const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    length: 6
  },
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  isVerify: {
    type: Boolean,
    default: false
  },
  emailToken: {
    type: String,
    default: ""
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

// create email option
UserSchema.methods.options = function (req, user) {
  const options = {
    from: "\"Verify your email - note taking app\"",
    to: user.email,
    subject: "notetakingapp - verify your email",
    html: `<h2> ${user.email}! Thanks for signing </h2>
          <h4> Please verify your email <a href="https://eager-fawn-overcoat.cyclic.app/auth/verify-mail?emailtoken=${user.emailToken}">here</a></h4>`
  };
  return options;
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
