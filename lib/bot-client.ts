async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `/api/bot${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bot API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  return (await res.text()) as unknown as T;
}

export interface BotStatus {
  cookiesValid: boolean;
  cookieCount: number;
  hasPSID: boolean;
  hasSID: boolean;
  lastModified: string | null;
  ageHours: number | null;
  browserActive: boolean;
  vncActive: boolean;
}

export interface GuildTrack {
  title: string;
  url: string;
  requestedBy: string;
  duration: string | null;
  position: number;
}

export interface GuildMusic {
  connected: boolean;
  voiceChannel: string | null;
  currentTrack: GuildTrack | null;
  queueSize: number;
  isPaused: boolean;
  autoplay: boolean;
  loopMode: string;
}

export interface GuildInfo {
  id: string;
  name: string;
  memberCount: number;
  blacklisted: boolean;
  music: GuildMusic;
}

export interface BlacklistEntry {
  guildId: string;
  guildName: string;
  blacklistedAt: string;
}

export interface BlacklistResponse {
  blacklist: BlacklistEntry[];
}

export interface GuildsResponse {
  deployMode: boolean;
  guilds: GuildInfo[];
}

export interface DeployToggleResponse {
  deployMode: boolean;
  disconnectedGuilds?: number;
  message: string;
}

export async function getGuilds(): Promise<GuildsResponse> {
  return request<GuildsResponse>("/api/guilds");
}

export async function toggleDeploy(): Promise<DeployToggleResponse> {
  return request<DeployToggleResponse>("/api/bot/toggle", { method: "POST" });
}

export async function getBlacklist(): Promise<BlacklistResponse> {
  return request<BlacklistResponse>("/api/blacklist");
}

export async function blacklistGuild(guildId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/guild/blacklist?id=${encodeURIComponent(guildId)}`, { method: "POST" });
}

export async function unblacklistGuild(guildId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/blacklist/remove?id=${encodeURIComponent(guildId)}`, { method: "POST" });
}

export async function leaveGuild(guildId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/guild/leave?id=${encodeURIComponent(guildId)}`, { method: "POST" });
}
