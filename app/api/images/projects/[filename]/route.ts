import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { logger } from "@/lib/logger";

const STORAGE_DIR = join(process.cwd(), "storage", "img", "projects");

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safeFilename) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = join(STORAGE_DIR, safeFilename);

    if (!existsSync(filePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const ext = safeFilename.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    logger.error("Failed to serve image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
