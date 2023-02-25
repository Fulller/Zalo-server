import mongoose from "mongoose";
import Message from "./Messages.js";
import User from "./Users.js";

const Conversations = new mongoose.Schema({
  conversationId: String,
  members: [User.schema],
  messages: [Message.schema],
  isGroup: { type: Boolean, default: false },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversations", Conversations);
