import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select({ cnt: count() }).from(user);
    return NextResponse.json({ hasUsers: result[0].cnt > 0 });
  } catch (error) {
    console.error("Setup status check failed:", error);
    return NextResponse.json({ hasUsers: false });
  }
}
