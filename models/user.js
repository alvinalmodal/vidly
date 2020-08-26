const mongoose = require("../startup/db")("user");
const { roleSchema } = require("./role");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 70,
    },
    email: {
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    password: {
      type: String,
      maxlength: 1024,
      required: true,
    },
    roles: {
      type: [roleSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
      message: "User should have at least one role.",
    },
  },
  { strict: true }
);

const User = mongoose.model("User", userSchema);

module.exports.userSchema = userSchema;
module.exports.User = User;
