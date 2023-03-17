import mongoose from "mongoose";

const Conversations = new mongoose.Schema({
  conversationId: String,
  members: [String],
  isGroup: { type: Boolean, default: false },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversations", Conversations);
