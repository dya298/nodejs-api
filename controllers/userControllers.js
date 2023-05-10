const User = require("../Models/Users/userModel");

exports.getUserNote = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;

    const users = await User.findById(id);

    return users;
  } catch (err) {
    console.log(err);
  }
};
