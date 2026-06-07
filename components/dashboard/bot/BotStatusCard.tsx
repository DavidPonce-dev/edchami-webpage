"use client";

import { BotStatus } from "@/lib/bot-client";
import { Cookie, Globe, Monitor } from "lucide-react";

interface Props {
  status: BotStatus | null;
  error: string | null;
  onRefresh: () => void;
  loading: boolean;
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

export function BotStatusCard({ status, error, onRefresh, loading }: Props) {
  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Bot Status</h2>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Retry"}
          </button>
        </div>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Verify DISCORD_BOT_URL and DISCORD_BOT_TOKEN in your .env
          </p>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const cookieColor = status.cookiesValid ? "text-green-500" : "text-destructive";
  const browserColor = status.browserActive ? "text-green-500" : "text-muted-foreground";
  const vncColor = status.vncActive ? "text-yellow-500" : "text-muted-foreground";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Bot Status</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatusItem
          icon={Cookie}
          label="Cookies"
          value={status.cookiesValid ? `Valid (${status.cookieCount})` : "Invalid"}
          color={cookieColor}
        />
        <StatusItem
          icon={Monitor}
          label="Browser"
          value={status.browserActive ? "Active" : "Inactive"}
          color={browserColor}
        />
        <StatusItem
          icon={Globe}
          label="VNC"
          value={status.vncActive ? "Active" : "Inactive"}
          color={vncColor}
        />
      </div>

      {status.ageHours !== null && (
        <p className="text-xs text-muted-foreground mt-3">
          Cookie age: {status.ageHours < 1 ? "< 1 hour" : `${Math.round(status.ageHours)}h`}
          {status.lastModified ? ` · Last updated: ${new Date(status.lastModified).toLocaleString()}` : ""}
        </p>
      )}
    </div>
  );
}
