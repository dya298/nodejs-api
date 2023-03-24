const express = require("express");
const createHttpError = require("http-errors");
const User = require("../../Models/Users/userModel");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const listUser = await User.find();
    res.send(listUser);
  } catch (error) {
    throw createHttpError.BadRequest(error.message);
  }
});

module.exports = router;
