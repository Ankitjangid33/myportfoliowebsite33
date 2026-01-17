import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import About from "@/models/About";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Get the about information - public endpoint
    const about = await About.findOne({});

    if (!about) {
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
      about: {
        bio: about.bio,
        title: about.title,
        skills: about.skills,
        experience: about.experience,
        education: about.education,
        displayName: about.displayName,
        initials: about.initials,
        profileImage: about.profileImage,
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

    // Find existing about or create new one
    let about = await About.findOne({});

    if (!about) {
      about = new About({
        bio,
        title,
        skills,
        experience,
        education,
        displayName,
        initials,
        profileImage,
      });
    } else {
      about.bio = bio;
      about.title = title;
      about.skills = skills;
      about.experience = experience;
      about.education = education;
      about.displayName = displayName;
      about.initials = initials;
      about.profileImage = profileImage;
    }

    await about.save();

    return NextResponse.json({
      success: true,
      about: {
        bio: about.bio,
        title: about.title,
        skills: about.skills,
        experience: about.experience,
        education: about.education,
        displayName: about.displayName,
        initials: about.initials,
        profileImage: about.profileImage,
      },
    });
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { error: "Failed to update about information" },
      { status: 500 },
    );
  }
}
