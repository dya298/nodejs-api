const express = require("express");
const createHttpError = require("http-errors");
const { verifyAccessToken } = require("../../Helpers/jwt");
const User = require("../../Models/Users/userModel");
const router = express.Router();

router.get("/", verifyAccessToken, async (req, res, next) => {
  try {
    const listUser = await User.find();
    res.send(listUser);
  } catch (error) {
    throw createHttpError.BadRequest(error.message);
  }
});

module.exports = router;
