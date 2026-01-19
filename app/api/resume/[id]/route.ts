import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const resume = await Resume.findById(id);

    if (!resume) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: resume });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const resume = await Resume.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!resume) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: resume });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update resume" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    await dbConnect();
    const resume = await Resume.findByIdAndDelete(id);

    if (!resume) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: resume });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete resume" },
      { status: 500 },
    );
  }
}
