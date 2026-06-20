"use client";

import { useEffect, useState, useCallback } from "react";
import { BotStatus } from "@/lib/bot-client";
import { BotStatusCard } from "@/components/dashboard/bot/BotStatusCard";
import { CookieManager } from "@/components/dashboard/bot/CookieManager";
import { ProfileActions } from "@/components/dashboard/bot/ProfileActions";
import { VNCFrame } from "@/components/dashboard/bot/VNCFrame";
import { GuildList } from "@/components/dashboard/bot/GuildList";
import { BlacklistPanel } from "@/components/dashboard/bot/BlacklistPanel";
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
  const [showVNC, setShowVNC] = useState(false);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, { timestamp: ts(), message }]);
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchStatus();
      setStatus(data);
      setError(null);
      addLog(
        `Estado: cookies=${data.cookiesValid ? "válidas" : "inválidas"} cantidad=${data.cookieCount} navegador=${data.browserActive ? "activo" : "inactivo"} vnc=${data.vncActive ? "activo" : "inactivo"}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, [addLog]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const withLoading = async (action: string, fn: () => Promise<unknown>, startMsg: string, successMsg: string): Promise<void> => {
    setLoading(action);
    addLog(startMsg);
    try {
      const result = await fn();
      addLog(`Resultado: ${JSON.stringify(result)}`);
      toast.success(successMsg);
      await loadStatus();
    } catch (err) {
      addLog(`Error: ${err instanceof Error ? err.message : "Acción fallida"}`);
      toast.error(err instanceof Error ? err.message : "Acción fallida");
    } finally {
      setLoading(null);
    }
  };

  const handleRefreshCookies = () =>
    withLoading("refresh", () => postAction("api/cookies/refresh"), "Actualizando cookies...", "Cookies actualizadas correctamente");

  const handleSetupVNC = async () => {
    setShowVNC(true);
    return withLoading("setup", () => postAction("api/cookies/setup"), "Iniciando sesión VNC...", "Sesión VNC iniciada");
  };

  const handleStopVNC = async () => {
    setShowVNC(false);
    return withLoading("stop", () => postAction("api/cookies/setup/stop"), "Deteniendo VNC...", "Sesión VNC detenida");
  };

  const handleResetProfile = () =>
    withLoading("reset", () => postAction("api/profile/reset"), "Restableciendo perfil del navegador...", "Perfil restablecido correctamente");

  const handleClearLog = () => setLogs([]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bot de Discord</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestione su bot Charmin Charmeleon
        </p>
      </div>

      <BotStatusCard status={status} error={error} />

      <CookieManager
        vncActive={status?.vncActive || false}
        onRefreshCookies={handleRefreshCookies}
        onSetupVNC={handleSetupVNC}
        onStopVNC={handleStopVNC}
        loading={loading}
      />

      {showVNC && <VNCFrame onClose={handleStopVNC} />}

      <GuildList />

      <BlacklistPanel />

      <ActivityLog entries={logs} onClear={handleClearLog} />

      <ProfileActions onReset={handleResetProfile} loading={loading === "reset"} />
    </div>
  );
}
