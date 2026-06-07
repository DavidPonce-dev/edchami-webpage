"use client";

import { useState } from "react";
import { Cookie, RefreshCw, Download, MonitorPlay, Square } from "lucide-react";
import { toast } from "sonner";

interface Props {
  vncActive: boolean;
  onRefreshCookies: () => Promise<void>;
  onExtractCookies: () => Promise<void>;
  onSetupVNC: () => Promise<void>;
  onStopVNC: () => Promise<void>;
  loading: string | null;
}

export function CookieManager({ vncActive, onRefreshCookies, onExtractCookies, onSetupVNC, onStopVNC, loading }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cookie className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Cookie Management</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onRefreshCookies}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading === "refresh" ? "animate-spin" : ""}`} />
          {loading === "refresh" ? "Refreshing..." : "Refresh Cookies (Headless)"}
        </button>

        <button
          onClick={onExtractCookies}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          {loading === "extract" ? "Extracting..." : "Extract Cookies"}
        </button>

        {!vncActive ? (
          <button
            onClick={onSetupVNC}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary disabled:opacity-50 transition-colors"
          >
            <MonitorPlay className="w-4 h-4" />
            {loading === "setup" ? "Starting..." : "Start VNC Setup"}
          </button>
        ) : (
          <button
            onClick={onStopVNC}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 rounded-lg text-sm font-medium text-destructive disabled:opacity-50 transition-colors"
          >
            <Square className="w-4 h-4" />
            {loading === "stop" ? "Stopping..." : "Stop VNC Session"}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        <strong>Refresh:</strong> Opens browser headlessly, logs in with existing session, saves cookies.
        <br />
        <strong>Extract:</strong> Saves cookies from currently open browser without closing it.
        <br />
        <strong>VNC Setup:</strong> Launches interactive browser for manual YouTube login.
      </p>
    </div>
  );
}
