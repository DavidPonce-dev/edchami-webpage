"use client";

import { Cookie, RefreshCw, MonitorPlay, Square } from "lucide-react";

interface Props {
  vncActive: boolean;
  onRefreshCookies: () => Promise<void>;
  onSetupVNC: () => Promise<void>;
  onStopVNC: () => Promise<void>;
  loading: string | null;
}

export function CookieManager({ vncActive, onRefreshCookies, onSetupVNC, onStopVNC, loading }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cookie className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Gestión de cookies</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onRefreshCookies}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading === "refresh" ? "animate-spin" : ""}`} />
          {loading === "refresh" ? "Actualizando..." : "Actualizar cookies"}
        </button>

        {!vncActive ? (
          <button
            onClick={onSetupVNC}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary disabled:opacity-50 transition-colors"
          >
            <MonitorPlay className="w-4 h-4" />
            {loading === "setup" ? "Iniciando..." : "Iniciar sesión VNC"}
          </button>
        ) : (
          <button
            onClick={onStopVNC}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 rounded-lg text-sm font-medium text-destructive disabled:opacity-50 transition-colors"
          >
            <Square className="w-4 h-4" />
            {loading === "stop" ? "Deteniendo..." : "Detener sesión VNC"}
          </button>
        )}
      </div>
    </div>
  );
}
