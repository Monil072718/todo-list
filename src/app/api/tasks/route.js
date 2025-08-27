import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { title, description } = await req.json();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const task = await Task.create({
      userId: decoded.userId,
      title,
      description,
    });

    return NextResponse.json({ message: "Task created", task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const tasks = await Task.find({ userId: decoded.userId });

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}