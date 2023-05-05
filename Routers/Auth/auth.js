const express = require("express");
const router = express.Router();
const CallBackReq = require("http-errors");
const nodeMailer = require("nodemailer");
const {
  signAccessToken,
  signRefreshToken,
  veriftyRefreshToken,
  signEmailToken,
} = require("../../Helpers/jwt");
const { authSchema, loginSchema } = require("../../Helpers/validation_schema");
const User = require("../../Models/Users/userModel");
const client = require("../../Helpers/init_redis");

router.post("/register", async (req, res, next) => {
  try {
    const resultSchema = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ email: resultSchema.email });
    if (doesExist) {
      return new CallBackReq.Conflict(
        `${resultSchema.email} is already been registered`
      );
    }
    const user = new User(resultSchema);
    const emailToken = await signEmailToken(resultSchema.email);
    // const set up email options
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ACCOUNT_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // set email token for user
    user.emailToken = emailToken;
    // get option display to html
    const option = user.options(req, user);

    // send mail
    await transporter.sendMail(option, async (error, info) => {
      if (error) next(error);
      // save into database
      await user.save();
      res.send("Verification email is send to your email account");
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.get("/verify-mail", async (req, res, next) => {
  try {
    const emailtoken = req.query.emailtoken;
    const user = await User.findOne({ emailToken: emailtoken });
    if (user) {
      user.isVerify = true;
      await user.save();
      res.send("Verify is successfully");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { res_refresh_token } = req.body;
    // eslint-disable-next-line camelcase
    if (!res_refresh_token) return CallBackReq.BadRequest();
    const userId = await veriftyRefreshToken(res_refresh_token);
    // eslint-disable-next-line camelcase
    const access_token = await signAccessToken(userId);
    // eslint-disable-next-line camelcase
    const refresh_token = await signRefreshToken(userId);
    // eslint-disable-next-line camelcase
    res.send({ userId, access_token, refresh_token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const resultSchema = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: resultSchema.email });
    if (!user) {
      return res.status(400).json({ message: "User's not register" });
    }
    if (!user.isVerify) {
      return res.status(400).json({ message: "Your email is not verify" });
    }
    const isMatch = user.isValidPassword(resultSchema.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email or password is not valid" });
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { res_refresh_token } = req.body;
    if (!res_refresh_token) return CallBackReq.BadRequest();
    const userID = await veriftyRefreshToken(res_refresh_token);
    client.DEL(userID, (err, val) => {
      if (err) {
        return res.status(500);
      }
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
