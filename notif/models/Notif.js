const mongoose = require("mongoose");
const NotifSchema = new mongoose.Schema({
  userIds: Array,
  type: String,
  content: String,
});

module.exports = mongoose.model("Notif", NotifSchema);
