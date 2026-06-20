"use client";

import { useEffect, useState, useCallback } from "react";
import { Server, Music, Play, Pause, Repeat, Shuffle, Power, Users, Volume2, ChevronDown, ChevronUp, LogOut, ShieldBan, ShieldCheck } from "lucide-react";
import { GuildInfo, GuildsResponse, blacklistGuild, unblacklistGuild, leaveGuild } from "@/lib/bot-client";
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

function GuildCard({ guild, onAction }: { guild: GuildInfo; onAction: () => void }) {
  const m = guild.music;
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const [confirmingBlacklist, setConfirmingBlacklist] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleLeave = async () => {
    setActionLoading("leave");
    try {
      await leaveGuild(guild.id);
      toast.success(`Left ${guild.name}`);
      onAction();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to leave guild");
    } finally {
      setActionLoading(null);
      setConfirmingLeave(false);
    }
  };

  const handleBlacklist = async () => {
    setActionLoading("blacklist");
    try {
      await blacklistGuild(guild.id);
      toast.success(`Blacklisted ${guild.name}`);
      onAction();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to blacklist guild");
    } finally {
      setActionLoading(null);
      setConfirmingBlacklist(false);
    }
  };

  const handleUnblacklist = async () => {
    setActionLoading("unblacklist");
    try {
      await unblacklistGuild(guild.id);
      toast.success(`Removed ${guild.name} from blacklist`);
      onAction();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unblacklist guild");
    } finally {
      setActionLoading(null);
    }
  };

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
        <div className="flex items-center gap-1.5">
          {guild.blacklisted && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-red-500/20 text-red-400">BLACKLISTED</span>
          )}
          <span className={`text-xs font-semibold px-2 py-1 rounded ${m.connected ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
            {m.connected ? "CONNECTED" : "IDLE"}
          </span>
        </div>
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

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
        {guild.blacklisted ? (
          <button
            onClick={handleUnblacklist}
            disabled={actionLoading !== null}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {actionLoading === "unblacklist" ? "..." : "Unblacklist"}
          </button>
        ) : (
          <>
            {!confirmingBlacklist ? (
              <button
                onClick={() => setConfirmingBlacklist(true)}
                disabled={actionLoading !== null}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
              >
                <ShieldBan className="w-3.5 h-3.5" />
                {actionLoading === "blacklist" ? "..." : "Blacklist"}
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleBlacklist}
                  disabled={actionLoading !== null}
                  className="px-2 py-1 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-500/90 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === "blacklist" ? "..." : "Confirm"}
                </button>
                <button
                  onClick={() => setConfirmingBlacklist(false)}
                  disabled={actionLoading !== null}
                  className="px-2 py-1 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            {!confirmingLeave ? (
              <button
                onClick={() => setConfirmingLeave(true)}
                disabled={actionLoading !== null}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Leave
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleLeave}
                  disabled={actionLoading !== null}
                  className="px-2 py-1 text-xs font-medium rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === "leave" ? "..." : "Confirm"}
                </button>
                <button
                  onClick={() => setConfirmingLeave(false)}
                  disabled={actionLoading !== null}
                  className="px-2 py-1 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function GuildList({ onGuildChange }: { onGuildChange?: () => void }) {
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);
  const [deployMode, setDeployMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

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
      loadGuilds();
    }, 5000);
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

  const handleGuildAction = useCallback(() => {
    loadGuilds();
    onGuildChange?.();
  }, [loadGuilds, onGuildChange]);

  if (error && guilds.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Servidores del bot</h2>
          </div>
        </div>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Servidores del bot</h2>
          <span className="text-xs text-muted-foreground">({guilds.length})</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
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
                <GuildCard key={g.id} guild={g} onAction={handleGuildAction} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
