import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { title, description, status } = await req.json();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { title, description, status },
      { new: true }
    );

    return NextResponse.json({ message: "Task updated", task });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    await Task.findOneAndDelete({ _id: id, userId: decoded.userId });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}
