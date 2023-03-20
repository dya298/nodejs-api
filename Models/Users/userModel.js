const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// called before save user in mongodb
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(this.password, salt);
    this.password = HashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password with password hash
UserSchema.methods.isValidPassword = async function (password) {
  // eslint-disable-next-line no-useless-catch
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
