"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";

const VNCViewer = dynamic(
  () => import("./VNCViewer").then((m) => ({ default: m.VNCViewer })),
  { ssr: false, loading: () => <div className="w-full h-full bg-black rounded-lg flex items-center justify-center"><p className="text-white/60 text-sm">Loading VNC...</p></div> }
);

interface Props {
  onClose: () => void;
}

function buildWebSocketUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/api/bot/vnc/websockify`;
}

export function VNCFrame({ onClose }: Props) {
  const wsUrl = buildWebSocketUrl();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">VNC Session</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          <VNCViewer wsUrl={wsUrl} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Use this interactive session to log in to YouTube manually. Once logged in, click &quot;Extract Cookies&quot; to save the session.
      </p>
    </div>
  );
}
