const express = require("express");
const router = express.Router();
const CallBackReq = require("http-errors");
const { signAccessToken, signRefreshToken } = require("../../Helpers/jwt");
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
    const saveUser = await user.save();
    const accessToken = await signAccessToken(saveUser.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({
      saveUser,
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("refresh-token route");
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

module.exports = router;
