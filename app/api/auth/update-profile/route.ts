import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log("Unauthorized: No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkedin, github, twitter, email, address, mobile } =
      await request.json();
    console.log("Received profile update:", {
      linkedin,
      github,
      twitter,
      email,
      address,
      mobile,
    });

    await connectDB();

    // Use user ID instead of email to find user
    const user = await User.findById(session.user.id);

    if (!user) {
      console.log("User not found with ID:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Current profile before update:", user.profile);

    // Update profile information
    user.profile = {
      linkedin: linkedin || "",
      github: github || "",
      twitter: twitter || "",
      email: email || "",
      address: address || "",
      mobile: mobile || "",
    };

    await user.save();
    console.log("Profile updated successfully:", user.profile);

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        profile: user.profile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log("GET: Unauthorized - No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Use user ID instead of email to find user
    const user = await User.findById(session.user.id);

    if (!user) {
      console.log("GET: User not found with ID:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("GET: Fetched profile:", user.profile);

    return NextResponse.json(
      {
        profile: user.profile || {
          linkedin: "",
          github: "",
          twitter: "",
          email: "",
          address: "",
          mobile: "",
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
