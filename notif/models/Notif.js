const mongoose = require("mongoose");
const NotifSchema = new mongoose.Schema({
  fromUserId: Number,
  targetUserId: Number,
  type: String,
  content: String,
  createdAt: Date,
});

module.exports = mongoose.model("Notif", NotifSchema);
