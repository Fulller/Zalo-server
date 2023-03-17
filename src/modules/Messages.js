import mongoose from "mongoose";

const Messages = new mongoose.Schema({
  conversationId: String,
  content: { type: String, require: true },
  type: { type: String, default: "message" },
  sender: { type: String, require: true },
  isRecover: { type: Boolean, default: false },
  deleteBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Messages", Messages);
