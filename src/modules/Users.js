import mongoose from "mongoose";

const Users = new mongoose.Schema({
  userName: { type: String, require: true },
  password: { type: String, require: true },
  showName: { type: String, require: true },
  avatar: String,
  background: String,
  describe: String,
  sex: { type: String, default: "male" },
  isOnline: { type: Boolean, default: false },
  dateOfBirth: Date,
  friends: [String],
  requesFriends: [String],
  wanttobeFriends: [String],
  groups: [String],
  roomIds: [String],
  messagesHistory: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Users", Users);
