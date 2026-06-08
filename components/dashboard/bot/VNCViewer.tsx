"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import RFB from "@novnc/novnc/core/rfb";

interface Props {
  wsUrl: string;
  onDisconnect?: () => void;
}

export function VNCViewer({ wsUrl, onDisconnect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rfbRef = useRef<RFB | null>(null);
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

    try {
      const rfb = new RFB(containerRef.current, wsUrl, {
        shared: true,
        repeaterID: "",
      });

      rfbRef.current = rfb;
      rfb.scaleViewport = true;
      rfb.resizeSession = false;
      rfb.viewOnly = false;
      rfb.background = "#000";

      rfb.addEventListener("connect", () => {
        setStatus("connected");
      });

      rfb.addEventListener("disconnect", (e: CustomEvent) => {
        setStatus("disconnected");
        if (e.detail?.clean === false) {
          setErrorMsg("Connection lost unexpectedly");
        }
        onDisconnect?.();
      });

      rfb.addEventListener("securityfailure", (e: CustomEvent) => {
        setStatus("error");
        setErrorMsg(`Security failure: ${e.detail?.reason || "unknown"}`);
      });

      rfb.addEventListener("credentialsrequired", () => {
        setStatus("error");
        setErrorMsg("Authentication required — check bot configuration");
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to initialize VNC");
    }

    return cleanup;
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
