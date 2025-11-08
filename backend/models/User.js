import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // profile fields
  linkedin: { type: String },
  bio: { type: String },
  career: { type: String },
  skills: { type: [String], default: [] },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
