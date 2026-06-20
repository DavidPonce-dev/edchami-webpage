"use client";

import { BotStatus } from "@/lib/bot-client";
import { Cookie, Globe, Monitor } from "lucide-react";

interface Props {
  status: BotStatus | null;
  error: string | null;
}

function StatusItem({ icon: Icon, label, value, color }: { icon: typeof Cookie; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <Icon className={`w-5 h-5 ${color || "text-muted-foreground"}`} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function BotStatusCard({ status, error }: Props) {
  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Estado del bot</h2>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Verifique DISCORD_BOT_URL y DISCORD_BOT_TOKEN en su .env
          </p>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const cookieColor = status.cookiesValid ? "text-emerald-500" : "text-destructive";
  const browserColor = status.browserActive ? "text-emerald-500" : "text-muted-foreground";
  const vncColor = status.vncActive ? "text-amber-500" : "text-muted-foreground";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Estado del bot</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatusItem
          icon={Cookie}
          label="Cookies"
          value={status.cookiesValid ? `Válidas (${status.cookieCount})` : "Inválidas"}
          color={cookieColor}
        />
        <StatusItem
          icon={Monitor}
          label="Navegador"
          value={status.browserActive ? "Activo" : "Inactivo"}
          color={browserColor}
        />
        <StatusItem
          icon={Globe}
          label="VNC"
          value={status.vncActive ? "Activo" : "Inactivo"}
          color={vncColor}
        />
      </div>

      {status.ageHours !== null && (
        <p className="text-xs text-muted-foreground mt-3">
          Antigüedad de cookies: {status.ageHours < 1 ? "< 1 hora" : `${Math.round(status.ageHours)}h`}
          {status.lastModified ? ` · Última actualización: ${new Date(status.lastModified).toLocaleString()}` : ""}
        </p>
      )}
    </div>
  );
}
