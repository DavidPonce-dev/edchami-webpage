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

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

export function VNCViewer({ wsUrl, onDisconnect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rfbRef = useRef<RFBInstance | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error" | "reconnecting">("connecting");
  const [errorMsg, setErrorMsg] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const cleanup = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!containerRef.current) return;

    cleanup();
    setStatus(retryCount > 0 ? "reconnecting" : "connecting");
    setErrorMsg("");

    let cancelled = false;

    (async () => {
      try {
        const { default: RFB } = await import("@novnc/novnc");

        if (cancelled || !containerRef.current) return;

        const rfb = new RFB(containerRef.current, wsUrl, {
          shared: true,
        }) as RFBInstance;

        rfbRef.current = rfb;
        rfb.scaleViewport = true;
        rfb.resizeSession = false;
        rfb.viewOnly = false;
        rfb.background = "#000";

        rfb.addEventListener("connect", () => {
          setRetryCount(0);
          setStatus("connected");
        });

        rfb.addEventListener("disconnect", (e: CustomEvent) => {
          if (cancelled) return;

          const isClean = e.detail?.clean !== false;

          if (!isClean && retryCount < MAX_RETRIES) {
            const nextRetry = retryCount + 1;
            setRetryCount(nextRetry);
            setStatus("reconnecting");
            setErrorMsg(`Reconectando en ${RETRY_DELAY_MS / 1000}s (intento ${nextRetry}/${MAX_RETRIES})`);

            retryTimerRef.current = setTimeout(() => {
              if (!cancelled) {
                connect();
              }
            }, RETRY_DELAY_MS);
          } else if (!isClean) {
            setStatus("error");
            setErrorMsg("Se perdió la conexión después de varios intentos");
            onDisconnect?.();
          } else {
            setStatus("disconnected");
            onDisconnect?.();
          }
        });

        rfb.addEventListener("securityfailure", (e: CustomEvent) => {
          if (!cancelled) {
            setStatus("error");
            setErrorMsg(`Error de seguridad: ${e.detail?.reason || "desconocido"}`);
          }
        });

        rfb.addEventListener("credentialsrequired", () => {
          if (!cancelled) {
            setStatus("error");
            setErrorMsg("Se requiere autenticación — verifique la configuración del bot");
          }
        });
      } catch (err) {
        if (!cancelled) {
          if (retryCount < MAX_RETRIES) {
            const nextRetry = retryCount + 1;
            setRetryCount(nextRetry);
            setStatus("reconnecting");
            setErrorMsg(`Reconectando en ${RETRY_DELAY_MS / 1000}s (intento ${nextRetry}/${MAX_RETRIES})`);

            retryTimerRef.current = setTimeout(() => {
              if (!cancelled) {
                connect();
              }
            }, RETRY_DELAY_MS);
          } else {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "No se pudo inicializar VNC");
          }
        }
      }
    })();

    return () => { cancelled = true; };
  }, [wsUrl, cleanup, retryCount, onDisconnect]);

  useEffect(() => {
    const cancelFn = connect();
    return () => {
      if (cancelFn) cancelFn();
    };
  }, [connect]);

  const handleManualReconnect = () => {
    setRetryCount(0);
    connect();
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {status === "connecting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/80 text-sm">Conectando a la sesión VNC...</p>
          </div>
        </div>
      )}

      {status === "reconnecting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-yellow-400 text-sm">{errorMsg}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center px-4">
            <p className="text-red-400 text-sm font-medium mb-1">Error de conexión</p>
            <p className="text-white/60 text-xs mb-3">{errorMsg}</p>
            <button
              onClick={handleManualReconnect}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs transition-colors"
            >
              Reconectar
            </button>
          </div>
        </div>
      )}

      {status === "disconnected" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-3">Sesión desconectada</p>
            <button
              onClick={handleManualReconnect}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs transition-colors"
            >
              Reconectar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
