import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    await dbConnect();

    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Admin already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      10,
    );

    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Setup failed" },
      { status: 500 },
    );
  }
}
