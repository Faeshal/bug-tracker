const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  title: String,
  status: String,
});

module.exports = mongoose.model("User", UserSchema);
