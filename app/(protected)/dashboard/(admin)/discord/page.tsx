"use client";

import { useState, useCallback } from "react";
import { BotStatusCard } from "@/components/dashboard/bot/BotStatusCard";
import { CookieManager } from "@/components/dashboard/bot/CookieManager";
import { ProfileActions } from "@/components/dashboard/bot/ProfileActions";
import { VNCFrame } from "@/components/dashboard/bot/VNCFrame";
import { GuildList } from "@/components/dashboard/bot/GuildList";
import { BlacklistPanel } from "@/components/dashboard/bot/BlacklistPanel";
import { ActivityLog, LogEntry } from "@/components/dashboard/bot/ActivityLog";
import {
  useBotStatus,
  useRefreshCookies,
  useSetupVNC,
  useStopVNC,
} from "@/lib/bot-queries";

function ts() {
  return new Date().toLocaleTimeString();
}

export default function DiscordDashboardPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showVNC, setShowVNC] = useState(false);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, { timestamp: ts(), message }]);
  }, []);

  const { data: status, error: statusError } = useBotStatus();

  const refreshCookies = useRefreshCookies(() =>
    addLog("Cookies actualizadas correctamente")
  );
  const setupVNC = useSetupVNC(() => addLog("Sesión VNC iniciada"));
  const stopVNC = useStopVNC(() => addLog("Sesión VNC detenida"));

  const handleRefreshCookies = async () => {
    addLog("Actualizando cookies...");
    refreshCookies.mutate(undefined);
  };

  const handleSetupVNC = async () => {
    setShowVNC(true);
    addLog("Iniciando sesión VNC...");
    setupVNC.mutate(undefined);
  };

  const handleStopVNC = async () => {
    setShowVNC(false);
    addLog("Deteniendo VNC...");
    stopVNC.mutate(undefined);
  };

  const handleClearLog = () => setLogs([]);

  const loading =
    refreshCookies.isPending
      ? "refresh"
      : setupVNC.isPending
        ? "setup"
        : stopVNC.isPending
          ? "stop"
          : null;

  const statusErrorMessage =
    statusError instanceof Error ? statusError.message : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bot de Discord</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestione su bot Charmin Charmeleon
        </p>
      </div>

      <BotStatusCard status={status ?? null} error={statusErrorMessage} />

      <CookieManager
        vncActive={status?.vncActive ?? false}
        onRefreshCookies={handleRefreshCookies}
        onSetupVNC={handleSetupVNC}
        onStopVNC={handleStopVNC}
        loading={loading}
      />

      {showVNC && <VNCFrame onClose={handleStopVNC} />}

      <GuildList />

      <BlacklistPanel />

      <ActivityLog entries={logs} onClear={handleClearLog} />

      <ProfileActions />
    </div>
  );
}
