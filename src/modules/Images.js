import mongoose from "mongoose";

const Images = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

export default mongoose.model("Images", Images);
