import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Get the first admin user's profile (you can modify this logic as needed)
    const user = await User.findOne({ role: "admin" });

    if (!user) {
      console.log("Public API: No admin user found");
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    console.log("Public API: Fetched profile:", user.profile);

    // Return only public profile information
    return NextResponse.json(
      {
        success: true,
        profile: {
          email: user.profile?.email || "",
          mobile: user.profile?.mobile || "",
          address: user.profile?.address || "",
          linkedin: user.profile?.linkedin || "",
          github: user.profile?.github || "",
          twitter: user.profile?.twitter || "",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
