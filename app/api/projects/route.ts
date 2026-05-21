import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";

export async function GET() {
  try {
    const db = await getDB();
    const projects = await db.getRepository(Project).find();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();
    const project = db.getRepository(Project).create(body);
    const saved = await db.getRepository(Project).save(project);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
