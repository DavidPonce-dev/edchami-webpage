"use client";

import { AlertTriangle, RotateCcw, Cookie, Trash2 } from "lucide-react";
import { useState } from "react";
import { useResetProfile, useDeleteCookies } from "@/lib/bot-queries";

export function ProfileActions() {
  const resetProfile = useResetProfile();
  const deleteCookies = useDeleteCookies();

  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmDeleteStep2, setConfirmDeleteStep2] = useState(false);

  const handleReset = async () => {
    setConfirmingReset(false);
    resetProfile.mutate();
  };

  const handleDeleteCookies = async () => {
    setConfirmDeleteStep2(false);
    setConfirmingDelete(false);
    deleteCookies.mutate();
  };

  return (
    <div className="bg-card border border-destructive/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h2 className="text-lg font-semibold text-foreground">Zona de peligro</h2>
      </div>

      <div className="space-y-4">
        {/* ── Eliminar cookies ── */}
        <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
          <p className="text-sm text-foreground font-medium">Eliminar cookies</p>
          <p className="text-xs text-muted-foreground mt-1">
            Borra todas las cookies del perfil actual. Después deberás iniciar sesión
            nuevamente por VNC para obtener cookies nuevas.
          </p>
        </div>

        {!confirmingDelete ? (
          <button
            onClick={() => { setConfirmingDelete(true); setConfirmDeleteStep2(false); }}
            disabled={deleteCookies.isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-md text-sm font-medium hover:bg-destructive/20 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {deleteCookies.isPending ? "Eliminando..." : "Eliminar cookies"}
          </button>
        ) : (
          <div className="space-y-2">
            {!confirmDeleteStep2 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDeleteStep2(true)}
                  disabled={deleteCookies.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                >
                  Sí, eliminar cookies
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleteCookies.isPending}
                  className="px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-destructive font-medium mb-2">
                  ¿Estás seguro? Esta acción eliminará todas las cookies y no se puede deshacer.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteCookies}
                    disabled={deleteCookies.isPending}
                    className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                  >
                    {deleteCookies.isPending ? "Eliminando..." : "Confirmar eliminación"}
                  </button>
                  <button
                    onClick={() => { setConfirmDeleteStep2(false); }}
                    disabled={deleteCookies.isPending}
                    className="px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <hr className="border-border/50" />

        {/* ── Restablecer perfil ── */}
        <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
          <p className="text-sm text-foreground font-medium">Restablecer perfil del navegador</p>
          <p className="text-xs text-muted-foreground mt-1">
            Finaliza todos los procesos de Chrome y elimina el directorio del perfil del navegador.
            Deberá volver a iniciar sesión por VNC después de esta acción.
          </p>
        </div>

        {!confirmingReset ? (
          <button
            onClick={() => setConfirmingReset(true)}
            disabled={resetProfile.isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-md text-sm font-medium hover:bg-destructive/20 disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {resetProfile.isPending ? "Restableciendo..." : "Restablecer perfil"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={resetProfile.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
            >
              {resetProfile.isPending ? "Restableciendo..." : "Confirmar"}
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              disabled={resetProfile.isPending}
              className="px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
