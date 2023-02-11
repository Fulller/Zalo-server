import mongoose from "mongoose";
import Users from "./Users";

const Messages = new mongoose.Schema({
  content: String,
  sender: {
    type: Users,
    default: {},
  },
  isRecover: { type: Boolean, default: false },
  deleteBy: [Users],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Messages", Messages);
