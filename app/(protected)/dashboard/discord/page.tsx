"use client";

import { useEffect, useState, useCallback } from "react";
import { BotStatus } from "@/lib/bot-client";
import { BotStatusCard } from "@/components/dashboard/bot/BotStatusCard";
import { CookieManager } from "@/components/dashboard/bot/CookieManager";
import { BrowserControls } from "@/components/dashboard/bot/BrowserControls";
import { ProfileActions } from "@/components/dashboard/bot/ProfileActions";
import { VNCFrame } from "@/components/dashboard/bot/VNCFrame";
import { ActivityLog, LogEntry } from "@/components/dashboard/bot/ActivityLog";
import { toast } from "sonner";

async function fetchStatus(): Promise<BotStatus> {
  const res = await fetch("/api/bot/api/status");
  if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
  return res.json();
}

async function postAction(path: string) {
  const res = await fetch(`/api/bot/${path}`, { method: "POST" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Action failed: ${res.status}`);
  }
  return res.json();
}

function ts() {
  return new Date().toLocaleTimeString();
}

export default function DiscordDashboardPage() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, { timestamp: ts(), message }]);
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchStatus();
      setStatus(data);
      setError(null);
      addLog(
        `Status: cookies=${data.cookiesValid ? "valid" : "invalid"} count=${data.cookieCount} browser=${data.browserActive ? "on" : "off"} vnc=${data.vncActive ? "on" : "off"}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [addLog]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const withLoading = async (action: string, fn: () => Promise<unknown>, startMsg: string, successMsg: string) => {
    setLoading(action);
    addLog(startMsg);
    try {
      const result = await fn();
      addLog(`Result: ${JSON.stringify(result)}`);
      toast.success(successMsg);
      await loadStatus();
    } catch (err) {
      addLog(`Error: ${err instanceof Error ? err.message : "Action failed"}`);
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(null);
    }
  };

  const handleRefreshCookies = () =>
    withLoading("refresh", () => postAction("api/cookies/refresh"), "Refreshing cookies...", "Cookies refreshed successfully");

  const handleExtractCookies = () =>
    withLoading("extract", () => postAction("api/cookies/extract"), "Extracting cookies from open browser...", "Cookies extracted successfully");

  const handleSetupVNC = () =>
    withLoading("setup", () => postAction("api/cookies/setup"), "Starting VNC login...", "VNC session started");

  const handleStopVNC = () =>
    withLoading("stop", () => postAction("api/cookies/setup/stop"), "Stopping VNC...", "VNC session stopped");

  const handleStartBrowser = () =>
    withLoading("start", () => postAction("api/browser/start"), "Starting headless browser...", "Browser started");

  const handleCloseBrowser = () =>
    withLoading("close", () => postAction("api/browser/close"), "Closing browser and extracting cookies...", "Browser closed and cookies extracted");

  const handleResetProfile = () =>
    withLoading("reset", () => postAction("api/profile/reset"), "Force resetting browser profile...", "Profile reset successfully");

  const handleClearLog = () => setLogs([]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Discord Bot</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your Charmin Charmeleon bot
        </p>
      </div>

      <BotStatusCard status={status} error={error} onRefresh={loadStatus} loading={loading !== null} />

      {status?.vncActive && <VNCFrame onClose={handleStopVNC} />}

      <CookieManager
        vncActive={status?.vncActive || false}
        onRefreshCookies={handleRefreshCookies}
        onExtractCookies={handleExtractCookies}
        onSetupVNC={handleSetupVNC}
        onStopVNC={handleStopVNC}
        loading={loading}
      />

      <BrowserControls
        browserActive={status?.browserActive || false}
        onStartBrowser={handleStartBrowser}
        onCloseBrowser={handleCloseBrowser}
        loading={loading}
      />

      <ProfileActions onReset={handleResetProfile} loading={loading === "reset"} />

      <ActivityLog entries={logs} onClear={handleClearLog} />
    </div>
  );
}
