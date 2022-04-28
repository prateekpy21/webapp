const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    Info: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Info"
      }
    ]
  })
);
module.exports = User;