"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onReset: () => Promise<void>;
  loading: boolean;
}

export function ProfileActions({ onReset, loading }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = async () => {
    setConfirming(false);
    await onReset();
  };

  return (
    <div className="bg-card border border-destructive/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
      </div>

      <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg mb-4">
        <p className="text-sm text-foreground font-medium">Reset Browser Profile</p>
        <p className="text-xs text-muted-foreground mt-1">
          Kills all Chrome processes and deletes the browser profile directory.
          You will need to re-login via VNC afterward.
        </p>
      </div>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-md text-sm font-medium hover:bg-destructive/20 disabled:opacity-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Profile
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Resetting..." : "Confirm Reset"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
