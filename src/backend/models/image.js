import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Image", imageSchema);