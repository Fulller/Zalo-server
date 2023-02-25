import mongoose from "mongoose";
import Users from "./Users.js";

const Messages = new mongoose.Schema({
  content: String,
  image: Buffer,
  type: { type: String, default: "message" },
  sender: String,
  isRecover: { type: Boolean, default: false },
  deleteBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Messages", Messages);
