import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    const contact = await Contact.create({ name, email, message });

    // Create notification for new contact
    await Notification.create({
      type: "contact",
      title: "New Contact Message",
      message: `${name} sent you a message: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"`,
      link: "/admin/contacts",
      relatedId: contact._id.toString(),
    });

    return NextResponse.json(
      { success: true, data: contact, message: "Message sent successfully!" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
