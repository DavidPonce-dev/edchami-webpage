import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { User } from "@/entities/User";

export async function GET() {
  try {
    const db = await getDB();
    const count = await db.getRepository(User).count();
    return NextResponse.json({ hasUsers: count > 0 });
  } catch (error) {
    console.error("Setup status check failed:", error);
    return NextResponse.json({ hasUsers: false });
  }
}
