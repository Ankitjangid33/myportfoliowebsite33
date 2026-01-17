import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Get the first user (admin) - public endpoint
    const user = await User.findOne({});

    if (!user) {
      return NextResponse.json({
        success: true,
        about: {
          bio: "",
          title: "",
          skills: [],
          experience: "",
          education: "",
          displayName: "",
          initials: "",
          profileImage: "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      about: user.about || {
        bio: "",
        title: "",
        skills: [],
        experience: "",
        education: "",
        displayName: "",
        initials: "",
        profileImage: "",
      },
    });
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { error: "Failed to fetch about information" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      bio,
      title,
      skills,
      experience,
      education,
      displayName,
      initials,
      profileImage,
    } = await req.json();

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: session.user?.email },
      {
        $set: {
          about: {
            bio,
            title,
            skills,
            experience,
            education,
            displayName,
            initials,
            profileImage,
          },
        },
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      about: user.about,
    });
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { error: "Failed to update about information" },
      { status: 500 },
    );
  }
}
