import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = join(process.cwd(), "public", "img", "projects");

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (user?.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Only JPG, PNG, and WebP are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.type.split("/")[1];
  const filename = `project-${timestamp}-${random}.${extension}`;
  const filepath = join(UPLOAD_DIR, filename);

  await writeFile(filepath, buffer);

  const imageUrl = `/img/projects/${filename}`;

  return NextResponse.json({ url: imageUrl }, { status: 200 });
}
