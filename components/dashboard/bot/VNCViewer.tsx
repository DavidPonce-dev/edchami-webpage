"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface RFBInstance {
  scaleViewport: boolean;
  resizeSession: boolean;
  viewOnly: boolean;
  background: string;
  disconnect(): void;
  clipboardPasteFrom(text: string): void;
  addEventListener(type: string, listener: (event: CustomEvent) => void): void;
}

interface Props {
  wsUrl: string;
  onDisconnect?: () => void;
}

export function VNCViewer({ wsUrl, onDisconnect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rfbRef = useRef<RFBInstance | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("connecting");
  const [errorMsg, setErrorMsg] = useState("");

  const cleanup = useCallback(() => {
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    cleanup();
    setStatus("connecting");
    setErrorMsg("");

    let cancelled = false;

    (async () => {
      try {
        console.log(`[VNCViewer] Connecting to WebSocket: ${wsUrl}`);
        console.log(`[VNCViewer] Protocol: ${window.location.protocol}`);
        console.log(`[VNCViewer] Host: ${window.location.host}`);

        const { default: RFB } = await import("@novnc/novnc");

        if (cancelled || !containerRef.current) return;

        console.log(`[VNCViewer] RFB module loaded, creating instance`);

        const rfb = new RFB(containerRef.current, wsUrl, {
          shared: true,
        }) as RFBInstance;

        rfbRef.current = rfb;
        rfb.scaleViewport = true;
        rfb.resizeSession = false;
        rfb.viewOnly = false;
        rfb.background = "#000";

        console.log(`[VNCViewer] RFB instance created, attaching event listeners`);

        rfb.addEventListener("connect", () => {
          console.log(`[VNCViewer] Connected successfully`);
          setStatus("connected");
        });

        rfb.addEventListener("disconnect", (e: CustomEvent) => {
          console.log(`[VNCViewer] Disconnected - clean: ${e.detail?.clean}`);
          console.log(`[VNCViewer] Event detail: ${JSON.stringify(e.detail)}`);
          setStatus("disconnected");
          if (e.detail?.clean === false) {
            setErrorMsg("Connection lost unexpectedly");
          }
          onDisconnect?.();
        });

        rfb.addEventListener("securityfailure", (e: CustomEvent) => {
          console.log(`[VNCViewer] Security failure: ${JSON.stringify(e.detail)}`);
          setStatus("error");
          setErrorMsg(`Security failure: ${e.detail?.reason || "unknown"}`);
        });

        rfb.addEventListener("credentialsrequired", () => {
          console.log(`[VNCViewer] Credentials required`);
          setStatus("error");
          setErrorMsg("Authentication required — check bot configuration");
        });
      } catch (err) {
        console.error(`[VNCViewer] Initialization error:`, err);
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Failed to initialize VNC");
        }
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [wsUrl, cleanup, onDisconnect]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {status === "connecting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/80 text-sm">Connecting to VNC session...</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center px-4">
            <p className="text-red-400 text-sm font-medium mb-1">Connection failed</p>
            <p className="text-white/60 text-xs">{errorMsg}</p>
          </div>
        </div>
      )}

      {status === "disconnected" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <p className="text-white/60 text-sm">Session disconnected</p>
        </div>
      )}
    </div>
  );
}
