import mongoose from "mongoose";
import Users from "./Users";
import Message from "./Messages";

const Conversations = new mongoose.Schema({
  roomId: String,
  members: [Users],
  messages: [Message],
  isGroup: { type: Boolean, default: false },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversations", Conversations);
