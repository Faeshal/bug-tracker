const mongoose = require("mongoose");
const NotifSchema = new mongoose.Schema({
  targetUserId: Number,
  type: String,
  content: String,
});

module.exports = mongoose.model("Notif", NotifSchema);
