"use client";

import { useState } from "react";
import { ShieldBan, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { BlacklistEntry } from "@/lib/bot-client";
import { useBlacklist, useUnblacklistGuild } from "@/lib/bot-queries";
import { toast } from "sonner";

interface Props {
  onBlacklistChange?: () => void;
}

export function BlacklistPanel({ onBlacklistChange }: Props) {
  const { data, isLoading } = useBlacklist();
  const unblacklist = useUnblacklistGuild();
  const [isOpen, setIsOpen] = useState(true);

  const entries: BlacklistEntry[] = data?.blacklist ?? [];

  const handleUnblacklist = (guildId: string, guildName: string) => {
    unblacklist.mutate(guildId, {
      onSuccess: () => {
        toast.success(`Removed ${guildName} from blacklist`);
        onBlacklistChange?.();
      },
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldBan className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-foreground">Servidores blacklisteados</h2>
          <span className="text-xs text-muted-foreground">({entries.length})</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          {isLoading && entries.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4 italic">Cargando...</p>
          ) : entries.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4 italic">No hay servidores blacklisteados</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.guildId}
                  className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{entry.guildName}</p>
                    <p className="text-xs text-muted-foreground">
                      Blacklisted: {new Date(entry.blacklistedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnblacklist(entry.guildId, entry.guildName)}
                    disabled={unblacklist.isPending && unblacklist.variables === entry.guildId}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {unblacklist.isPending && unblacklist.variables === entry.guildId
                      ? "..."
                      : "Quitar blacklist"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
