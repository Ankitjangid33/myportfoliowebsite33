// Run this script to create the admin user
// Usage: node scripts/setup.js

require("dotenv").config({ path: ".env.local" });
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

console.log("📝 Using MongoDB URI:", MONGODB_URI.substring(0, 30) + "...");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    role: { type: String, default: "admin" },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function setup() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (existingUser) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("\nYou can now login at /admin/login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setup();
