import mongoose from "mongoose";

const Messages = new mongoose.Schema({
  content: String,
  image: Buffer,
  type: { type: String, default: "message" },
  sender: String,
  isRecover: { type: Boolean, default: false },
  deleteBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  timezone: { type: String, default: "Asia/Hanoi" },
});

export default mongoose.model("Messages", Messages);
