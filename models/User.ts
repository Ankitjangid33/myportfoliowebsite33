import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    role: {
      type: String,
      default: "admin",
    },
    profile: {
      linkedin: String,
      github: String,
      twitter: String,
      email: String,
      address: String,
      mobile: String,
    },
    about: {
      bio: String,
      title: String,
      skills: [String],
      experience: String,
      education: String,
    },
    lastPasswordChange: {
      type: Date,
      default: null,
    },
    lastEmailChange: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
