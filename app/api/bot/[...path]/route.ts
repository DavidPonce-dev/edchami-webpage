import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

const BOT_URL = process.env.DISCORD_BOT_URL || "";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}

async function proxyRequest(request: NextRequest, params: Promise<{ path: string[] }>) {
  const resolved = await params;
  const path = resolved.path.join("/");

  if (path.startsWith("vnc/")) {
    return NextResponse.json(
      { error: "VNC routes handled by server.js proxy" },
      { status: 503 }
    );
  }

  const user = await getUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!BOT_URL || !BOT_TOKEN) {
    return NextResponse.json({ error: "Bot not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const targetUrl = `${BOT_URL}/${path}?token=${encodeURIComponent(BOT_TOKEN)}${searchParams ? `&${searchParams}` : ""}`;

  const body = request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const fetchInit: RequestInit = {
    method: request.method,
    headers,
  };

  if (body) {
    fetchInit.body = body;
  }

  try {
    const res = await fetch(targetUrl, fetchInit);

    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const contentType = res.headers.get("content-type") || "application/octet-stream";

    if (contentType.includes("text/html") || contentType.includes("text/plain")) {
      const text = await res.text();
      return new NextResponse(text, { status: res.status, headers: responseHeaders });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, { status: res.status, headers: responseHeaders });
  } catch {
    return NextResponse.json({ error: "Failed to connect to bot" }, { status: 502 });
  }
}
