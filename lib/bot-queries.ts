import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  BotStatus,
  GuildsResponse,
  BlacklistResponse,
  getBlacklist,
  blacklistGuild,
  unblacklistGuild,
  leaveGuild,
} from "@/lib/bot-client";
import { toast } from "sonner";

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const botKeys = {
  all: ["bot"] as const,
  status: () => [...botKeys.all, "status"] as const,
  guilds: () => [...botKeys.all, "guilds"] as const,
  blacklist: () => [...botKeys.all, "blacklist"] as const,
};

// ─── Fetchers ──────────────────────────────────────────────────────────────────

async function fetchStatus(): Promise<BotStatus> {
  const res = await fetch("/api/bot/api/status");
  if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
  return res.json();
}

async function fetchGuilds(): Promise<GuildsResponse> {
  const res = await fetch("/api/bot/api/guilds");
  if (!res.ok) throw new Error(`Failed to fetch guilds: ${res.status}`);
  return res.json();
}

async function postAction(path: string): Promise<unknown> {
  const res = await fetch(`/api/bot/${path}`, { method: "POST" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Action failed: ${res.status}`);
  }
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

// ─── Queries ───────────────────────────────────────────────────────────────────

export function useBotStatus(
  options?: Partial<UseQueryOptions<BotStatus>>
) {
  return useQuery<BotStatus>({
    queryKey: botKeys.status(),
    queryFn: fetchStatus,
    staleTime: 30_000,
    refetchInterval: 30_000,
    ...options,
  });
}

export function useGuilds(
  options?: Partial<UseQueryOptions<GuildsResponse>>
) {
  return useQuery<GuildsResponse>({
    queryKey: botKeys.guilds(),
    queryFn: fetchGuilds,
    staleTime: 30_000,
    refetchInterval: 30_000,
    ...options,
  });
}

export function useBlacklist(
  options?: Partial<UseQueryOptions<BlacklistResponse>>
) {
  return useQuery<BlacklistResponse>({
    queryKey: botKeys.blacklist(),
    queryFn: getBlacklist,
    staleTime: 60_000,
    refetchInterval: 60_000,
    ...options,
  });
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

export function useRefreshCookies(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction("api/cookies/refresh"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.status() });
      toast.success("Cookies actualizadas correctamente");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al actualizar cookies");
    },
  });
}

export function useSetupVNC(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction("api/cookies/setup"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.status() });
      toast.success("Sesión VNC iniciada");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al iniciar VNC");
    },
  });
}

export function useStopVNC(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction("api/cookies/setup/stop"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.status() });
      toast.success("Sesión VNC detenida");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al detener VNC");
    },
  });
}

export function useDeleteCookies(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction("api/cookies/delete"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.status() });
      toast.success("Cookies eliminadas correctamente");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al eliminar cookies");
    },
  });
}

export function useResetProfile(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction("api/profile/reset"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.status() });
      toast.success("Perfil restablecido correctamente");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al restablecer perfil");
    },
  });
}

export function useDeployToggle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postToggle,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: botKeys.guilds() });
      toast.success(result.message);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Toggle failed");
    },
  });
}

export function useBlacklistGuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guildId: string) => blacklistGuild(guildId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.guilds() });
      queryClient.invalidateQueries({ queryKey: botKeys.blacklist() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to blacklist guild");
    },
  });
}

export function useUnblacklistGuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guildId: string) => unblacklistGuild(guildId),
    // Optimistic update: sacar de la lista antes de que responda el server
    onMutate: async (guildId) => {
      await queryClient.cancelQueries({ queryKey: botKeys.blacklist() });
      const previous = queryClient.getQueryData<BlacklistResponse>(botKeys.blacklist());
      queryClient.setQueryData<BlacklistResponse>(botKeys.blacklist(), (old) => {
        if (!old) return old;
        return {
          blacklist: old.blacklist.filter((e) => e.guildId !== guildId),
        };
      });
      return { previous };
    },
    onError: (err, _guildId, context) => {
      // Rollback si falló
      if (context?.previous) {
        queryClient.setQueryData(botKeys.blacklist(), context.previous);
      }
      toast.error(err instanceof Error ? err.message : "Failed to unblacklist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.blacklist() });
      queryClient.invalidateQueries({ queryKey: botKeys.guilds() });
    },
  });
}

export function useLeaveGuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guildId: string) => leaveGuild(guildId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.guilds() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to leave guild");
    },
  });
}
