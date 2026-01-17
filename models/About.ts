import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    displayName: {
      type: String,
      default: "",
    },
    initials: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
