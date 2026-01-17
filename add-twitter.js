const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const UserSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    role: String,
    profile: {
      linkedin: String,
      github: String,
      twitter: String,
      email: String,
      address: String,
      mobile: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function addTwitter() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ role: "admin" });

    if (user) {
      console.log("Current profile:", user.profile);

      // Add Twitter URL (you can change this to your actual Twitter URL)
      user.profile.twitter = "https://twitter.com/yourusername";

      await user.save();

      console.log("\n✅ Twitter added successfully!");
      console.log("Updated profile:", user.profile);
    } else {
      console.log("No admin user found");
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addTwitter();
