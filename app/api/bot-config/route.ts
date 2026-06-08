import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const botUrl = process.env.DISCORD_BOT_URL || "";

  let wsUrl = "";
  if (botUrl) {
    wsUrl = botUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  }

  return NextResponse.json({
    botWsUrl: wsUrl,
  });
}
