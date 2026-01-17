import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const sampleNotifications = [
      {
        type: "contact",
        title: "New Contact Message",
        message:
          "John Doe sent you a message about collaboration opportunities",
        link: "/admin/contacts",
        read: false,
      },
      {
        type: "project",
        title: "Project Updated",
        message: "Your portfolio project has been successfully updated",
        link: "/admin/projects",
        read: false,
      },
      {
        type: "system",
        title: "Welcome to Notifications",
        message: "Your notification system is now active and ready to use!",
        read: true,
      },
    ];

    await Notification.insertMany(sampleNotifications);

    return NextResponse.json({
      success: true,
      message: "Sample notifications created",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to seed notifications" },
      { status: 500 },
    );
  }
}
