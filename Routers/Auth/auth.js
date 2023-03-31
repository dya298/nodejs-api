const express = require("express");
const router = express.Router();
const CallBackReq = require("http-errors");
const nodeMailer = require("nodemailer");
const {
  signAccessToken,
  signRefreshToken,
  veriftyRefreshToken,
  signEmailToken
} = require("../../Helpers/jwt");
const { authSchema } = require("../../Helpers/validation_schema");
const User = require("../../Models/Users/userModel");

router.post("/register", async (req, res, next) => {
  try {
    const resultSchema = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ email: resultSchema.email });
    if (doesExist) {
      throw new CallBackReq.Conflict(
        `${resultSchema.email} is already been registered`
      );
    }
    const user = new User(resultSchema);
    // const emailToken = await signEmailToken(resultSchema.email);
    // const set up email options
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "tranduy030700@gmail.com",
        pass: "fhezngdxaotdokkz"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const option = user.options(req, user);

    transporter.sendMail(option, (error, info) => {
      if (error) next(error);
      res.send(`Verification email is send to your email account + ${info.response}`);
    });
    // const saveUser = await user.save();
    // const accessToken = await signAccessToken(saveUser.id);
    // const refreshToken = await signRefreshToken(user.id);
    // res.send({
    //   saveUser,
    //   access_token: accessToken,
    //   refresh_token: refreshToken
    // });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { res_refresh_token } = req.body;
    // eslint-disable-next-line camelcase
    if (!res_refresh_token) throw CallBackReq.BadRequest();
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
    const resultSchema = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: resultSchema.email });
    if (!user) {
      throw CallBackReq.BadRequest("User's not register");
    }
    const isMatch = await user.isValidPassword(resultSchema.password);
    if (!isMatch) {
      throw CallBackReq.Unauthorized("Email or password is not valid");
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({
      user,
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (error) {
    if (error.isJoi === true) {
      throw CallBackReq.BadRequest("Invalid email or password");
    }
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  res.send("logout route");
});

router.get("/verify-mail", async (req, res, next) => {
  res.send("verify-mail route");
});

module.exports = router;
