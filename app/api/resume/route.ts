import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET() {
  try {
    await dbConnect();
    const resumes = await Resume.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: resumes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch resumes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const body = await request.json();
    const resume = await Resume.create(body);

    return NextResponse.json({ success: true, data: resume }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create resume" },
      { status: 500 },
    );
  }
}
