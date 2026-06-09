"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const VNCViewer = dynamic(
  () => import("./VNCViewer").then((m) => ({ default: m.VNCViewer })),
  { ssr: false, loading: () => <div className="w-full h-full bg-black rounded-lg flex items-center justify-center"><p className="text-white/60 text-sm">Cargando VNC...</p></div> }
);

interface Props {
  onClose: () => void;
}

export function VNCFrame({ onClose }: Props) {
  const [wsUrl, setWsUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/bot-config");
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const { botWsUrl, botToken } = await res.json();

        if (!cancelled && botWsUrl) {
          const tokenParam = botToken ? `?token=${encodeURIComponent(botToken)}` : "";
          setWsUrl(`${botWsUrl}/vnc/websockify${tokenParam}`);
        }
      } catch {
        if (!cancelled) {
          const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
          setWsUrl(`${protocol}//${window.location.host}/api/bot/vnc/websockify`);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (!wsUrl) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Sesión VNC</h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
            <p className="text-white/60 text-sm">Cargando configuración VNC...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Sesión VNC</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          <VNCViewer wsUrl={wsUrl} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Use esta sesión interactiva para iniciar sesión en YouTube manualmente. Una vez autenticado, haga clic en &quot;Extraer cookies&quot; para guardar la sesión.
      </p>
    </div>
  );
}
