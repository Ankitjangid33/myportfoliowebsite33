import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Define schemas directly to avoid model conflicts
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  profile: Object,
  about: Object,
  lastPasswordChange: Date,
  lastEmailChange: Date,
  createdAt: Date,
  updatedAt: Date,
});

const AboutSchema = new mongoose.Schema(
  {
    bio: String,
    title: String,
    skills: [String],
    experience: String,
    education: String,
    displayName: String,
    initials: String,
    profileImage: String,
  },
  {
    timestamps: true,
  },
);

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Get the old users collection
    const OldUser = mongoose.model("OldUser", UserSchema, "users");
    const About = mongoose.model("About", AboutSchema, "abouts");
    const Admin = mongoose.model("Admin", UserSchema, "admin");

    // Find user with about data
    const user = await OldUser.findOne({ about: { $exists: true } });

    if (!user) {
      console.log("No user with about data found");
    } else if (user.about) {
      console.log("Found user with about data:", user.email);

      // Check if About document already exists
      let aboutDoc = await About.findOne({});

      if (aboutDoc) {
        console.log("About document already exists, updating...");
        aboutDoc.bio = user.about.bio || "";
        aboutDoc.title = user.about.title || "";
        aboutDoc.skills = user.about.skills || [];
        aboutDoc.experience = user.about.experience || "";
        aboutDoc.education = user.about.education || "";
        aboutDoc.displayName = user.about.displayName || "";
        aboutDoc.initials = user.about.initials || "";
        aboutDoc.profileImage = user.about.profileImage || "";
        await aboutDoc.save();
      } else {
        console.log("Creating new About document...");
        aboutDoc = new About({
          bio: user.about.bio || "",
          title: user.about.title || "",
          skills: user.about.skills || [],
          experience: user.about.experience || "",
          education: user.about.education || "",
          displayName: user.about.displayName || "",
          initials: user.about.initials || "",
          profileImage: user.about.profileImage || "",
        });
        await aboutDoc.save();
      }

      console.log("About data migrated successfully");
    }

    // Migrate user data to admin collection
    console.log("\nMigrating users to admin collection...");
    const users = await OldUser.find({});

    for (const user of users) {
      const existingAdmin = await Admin.findOne({ email: user.email });

      if (!existingAdmin) {
        console.log(`Migrating user: ${user.email}`);
        const adminData = {
          email: user.email,
          password: user.password,
          name: user.name,
          role: user.role,
          profile: user.profile,
          lastPasswordChange: user.lastPasswordChange,
          lastEmailChange: user.lastEmailChange,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        await Admin.create(adminData);
        console.log(`✓ Migrated: ${user.email}`);
      } else {
        console.log(`✓ Already exists in admin collection: ${user.email}`);
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Verify the data in 'admin' and 'abouts' collections");
    console.log(
      "2. Once verified, you can manually drop the old 'users' collection",
    );
    console.log("   Run in MongoDB: db.users.drop()");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
}

migrate();
