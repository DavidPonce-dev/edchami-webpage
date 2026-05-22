import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: "bold",
            color: "#f8fafc",
            marginBottom: 20,
          }}
        >
          EdChami
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          Developer • Builder • Problem Solver
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            padding: "12px 24px",
            border: "2px solid #38bdf8",
            borderRadius: 8,
            fontSize: 18,
            color: "#38bdf8",
          }}
        >
          edchami.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
