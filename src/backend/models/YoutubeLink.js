import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "live_settings" },
  youtubeUrl: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Youtube", configSchema);