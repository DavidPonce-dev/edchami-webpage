"use client";

import { FileText, Trash2 } from "lucide-react";
import { useRef, useEffect } from "react";

export interface LogEntry {
  timestamp: string;
  message: string;
}

interface Props {
  entries: LogEntry[];
  onClear: () => void;
}

export function ActivityLog({ entries, onClear }: Props) {
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Activity Log</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {entries.length}
          </span>
        </div>
        <button
          onClick={onClear}
          disabled={entries.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      <pre
        ref={logRef}
        className="bg-muted/50 border border-border rounded-lg p-4 text-xs font-mono text-muted-foreground max-h-64 overflow-y-auto leading-relaxed"
      >
        {entries.length === 0
          ? "Ready."
          : entries.map((entry, i) => (
              <div key={i} className="whitespace-pre-wrap">
                [{entry.timestamp}] {entry.message}
              </div>
            ))}
      </pre>
    </div>
  );
}
