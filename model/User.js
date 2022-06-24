const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    user: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  refreshToken: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userModel);
