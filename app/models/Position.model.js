const mongoose = require("mongoose");
const Position = mongoose.model(
  "Position",
  new mongoose.Schema({
    name: String,
  })
);
module.exports = Position;