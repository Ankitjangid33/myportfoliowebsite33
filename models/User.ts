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
    collection: "admin", // Rename collection to 'admin'
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
