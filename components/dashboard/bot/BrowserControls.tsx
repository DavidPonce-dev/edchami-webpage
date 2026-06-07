"use client";

import { Monitor, Power } from "lucide-react";
import { toast } from "sonner";

interface Props {
  browserActive: boolean;
  onStartBrowser: () => Promise<void>;
  onCloseBrowser: () => Promise<void>;
  loading: string | null;
}

export function BrowserControls({ browserActive, onStartBrowser, onCloseBrowser, loading }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Browser Controls</h2>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full ${browserActive ? "bg-green-500" : "bg-muted-foreground/50"}`} />
        <span className="text-sm text-muted-foreground">
          Browser is {browserActive ? "running" : "stopped"}
        </span>
      </div>

      <div className="flex gap-3">
        {!browserActive ? (
          <button
            onClick={onStartBrowser}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Power className="w-4 h-4" />
            {loading === "start" ? "Starting..." : "Start Browser"}
          </button>
        ) : (
          <button
            onClick={onCloseBrowser}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
          >
            <Power className="w-4 h-4" />
            {loading === "close" ? "Closing..." : "Close Browser & Extract"}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Closing the browser automatically extracts and saves cookies.
      </p>
    </div>
  );
}
