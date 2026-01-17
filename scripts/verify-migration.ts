import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB\n");

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection not established");
    }

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("📋 Available collections:");
    collections.forEach((col) => {
      console.log(`  - ${col.name}`);
    });

    // Check admin collection
    console.log("\n👤 Admin collection:");
    const adminCount = await db.collection("admin").countDocuments();
    console.log(`  Total documents: ${adminCount}`);

    const adminSample = await db.collection("admin").findOne({});
    if (adminSample) {
      console.log(
        `  Sample document fields: ${Object.keys(adminSample).join(", ")}`,
      );
      console.log(
        `  Has 'about' field: ${adminSample.about ? "❌ YES (should be removed)" : "✅ NO"}`,
      );
    }

    // Check abouts collection
    console.log("\n📝 Abouts collection:");
    const aboutsCount = await db.collection("abouts").countDocuments();
    console.log(`  Total documents: ${aboutsCount}`);

    const aboutSample = await db.collection("abouts").findOne({});
    if (aboutSample) {
      console.log(
        `  Sample document fields: ${Object.keys(aboutSample).join(", ")}`,
      );
      console.log(`  Display Name: ${aboutSample.displayName || "N/A"}`);
      console.log(`  Title: ${aboutSample.title || "N/A"}`);
    }

    // Check if old users collection still exists
    const usersExists = collections.some((col) => col.name === "users");
    console.log(
      `\n🗑️  Old 'users' collection: ${usersExists ? "❌ Still exists (should be removed)" : "✅ Removed"}`,
    );

    console.log("\n✅ Verification complete!");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
}

verify();
