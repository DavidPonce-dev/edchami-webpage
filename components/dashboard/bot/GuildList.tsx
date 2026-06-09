"use client";

import { useEffect, useState, useCallback } from "react";
import { Server, Music, Play, Pause, Repeat, Shuffle, Power, Users, Volume2 } from "lucide-react";
import { GuildInfo, GuildsResponse } from "@/lib/bot-client";
import { toast } from "sonner";

async function fetchGuilds(): Promise<GuildsResponse> {
  const res = await fetch("/api/bot/api/guilds");
  if (!res.ok) throw new Error(`Failed to fetch guilds: ${res.status}`);
  return res.json();
}

async function postToggle(): Promise<{ deployMode: boolean; message: string }> {
  const res = await fetch("/api/bot/api/bot/toggle", { method: "POST" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Toggle failed: ${res.status}`);
  }
  return res.json();
}

function formatTime(seconds: number | null): string {
  if (seconds == null) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function GuildCard({ guild }: { guild: GuildInfo }) {
  const m = guild.music;

  return (
    <div className={`border rounded-lg p-4 transition-colors ${m.connected ? "border-green-500/30 bg-green-500/5" : "border-border bg-muted/30"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm text-foreground">{guild.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              {guild.memberCount} members
            </p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${m.connected ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
          {m.connected ? "CONNECTED" : "IDLE"}
        </span>
      </div>

      {m.connected && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Volume2 className="w-3 h-3" />
            <span>{m.voiceChannel || "Unknown channel"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded p-2">
              <p className="text-muted-foreground text-[10px] uppercase">Queue</p>
              <p className="font-medium">{m.queueSize}</p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-muted-foreground text-[10px] uppercase">Autoplay</p>
              <p className="font-medium flex items-center gap-1">
                <Shuffle className="w-3 h-3" />
                {m.autoplay ? "ON" : "OFF"}
              </p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-muted-foreground text-[10px] uppercase">Loop</p>
              <p className="font-medium flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                {m.loopMode}
              </p>
            </div>
          </div>

          {m.currentTrack ? (
            <div className="bg-primary/5 border border-primary/20 rounded p-2 mt-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Music className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground text-[10px] uppercase">Now Playing</span>
                {m.isPaused && <Pause className="w-3 h-3 text-yellow-400" />}
              </div>
              <p className="font-medium text-sm text-foreground truncate">{m.currentTrack.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-muted-foreground text-[10px]">Requested by {m.currentTrack.requestedBy}</p>
                <p className="text-muted-foreground text-[10px]">
                  {formatTime(m.currentTrack.position)} / {m.currentTrack.duration || "??:??"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs italic mt-1">No track playing</p>
          )}
        </div>
      )}
    </div>
  );
}

export function GuildList() {
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);
  const [deployMode, setDeployMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshSec, setRefreshSec] = useState(5);

  const loadGuilds = useCallback(async () => {
    try {
      const data = await fetchGuilds();
      setGuilds(data.guilds);
      setDeployMode(data.deployMode);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, []);

  useEffect(() => {
    loadGuilds();
  }, [loadGuilds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshSec((prev) => {
        if (prev <= 1) {
          loadGuilds();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loadGuilds]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await postToggle();
      setDeployMode(result.deployMode);
      toast.success(result.message);
      await loadGuilds();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setLoading(false);
    }
  };

  if (error && guilds.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Servidores del bot</h2>
        </div>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Servidores del bot</h2>
          <span className="text-xs text-muted-foreground">({guilds.length})</span>
        </div>
        <p className="text-xs text-muted-foreground">Refreshing in {refreshSec}s</p>
      </div>

      <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${deployMode ? "bg-red-500" : "bg-green-500"}`} />
          <span className="text-sm font-medium">
            {deployMode ? "Service Disabled (Deploy Mode)" : "Service Active"}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
            deployMode
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "bg-destructive/20 text-destructive hover:bg-destructive/30"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {loading ? "Processing..." : deployMode ? "Enable Service" : "Disable Service"}
        </button>
      </div>

      {guilds.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4 italic">No servers found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guilds.map((g) => (
            <GuildCard key={g.id} guild={g} />
          ))}
        </div>
      )}
    </div>
  );
}
