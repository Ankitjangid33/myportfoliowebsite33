import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function cleanup() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection not established");
    }

    // Check if users collection exists
    const collections = await db.listCollections({ name: "users" }).toArray();

    if (collections.length > 0) {
      console.log("\nDropping old 'users' collection...");
      await db.dropCollection("users");
      console.log("✓ Old 'users' collection dropped successfully");
    } else {
      console.log("\n✓ No 'users' collection found (already cleaned up)");
    }

    // Remove 'about' field from admin collection if it exists
    console.log("\nRemoving 'about' field from admin documents...");
    const result = await db
      .collection("admin")
      .updateMany({ about: { $exists: true } }, { $unset: { about: "" } });

    if (result.modifiedCount > 0) {
      console.log(
        `✓ Removed 'about' field from ${result.modifiedCount} admin document(s)`,
      );
    } else {
      console.log("✓ No 'about' fields found in admin collection");
    }

    console.log("\n✅ Cleanup completed successfully!");
    console.log("\nYour database structure is now:");
    console.log(
      "- 'admin' collection (renamed from 'users', without 'about' field)",
    );
    console.log("- 'abouts' collection (separate collection for about data)");
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
}

cleanup();
