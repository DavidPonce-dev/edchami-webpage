"use client";

import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export function VNCFrame({ onClose }: Props) {
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
        <iframe
          src="/api/bot/vnc/?path="
          className="absolute inset-0 w-full h-full rounded-lg border border-border"
          title="VNC Session"
          allow="clipboard-read; clipboard-write"
        />
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Use this interactive session to log in to YouTube manually. Once logged in, click &quot;Extract Cookies&quot; to save the session.
      </p>
    </div>
  );
}
