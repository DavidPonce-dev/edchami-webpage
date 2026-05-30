import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { logger } from "@/lib/logger";
import { verifyToken } from "@/lib/jwt";
import type { PublicUser } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const UPLOAD_DIR = join(process.cwd(), "public", "img", "projects");

async function getUserFromRequest(request: NextRequest): Promise<PublicUser | null> {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken<PublicUser>(token);
}

function generateFileName(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
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

    await mkdir(UPLOAD_DIR, { recursive: true });

    const fileName = generateFileName(file.name);
    const filePath = join(UPLOAD_DIR, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, bytes);

    const imageUrl = `/img/projects/${fileName}`;
    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    logger.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
