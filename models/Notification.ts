import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["contact", "project", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    relatedId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
