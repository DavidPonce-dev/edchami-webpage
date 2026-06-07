const BOT_URL = process.env.DISCORD_BOT_URL || "";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";

function buildUrl(path: string, token = true): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${BOT_URL}${path}${token ? `${separator}token=${encodeURIComponent(BOT_TOKEN)}` : ""}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!BOT_URL) throw new Error("DISCORD_BOT_URL not configured");
  if (!BOT_TOKEN) throw new Error("DISCORD_BOT_TOKEN not configured");

  const url = buildUrl(path, options.method !== undefined && path.startsWith("/vnc") ? false : true);

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

  return text() as Promise<T>;

  async function text() {
    return (await res.text()) as unknown as T;
  }
}

export interface BotHealth {
  status: string;
  service: string;
  cookies: {
    valid: boolean;
    count: number;
    hasPSID: boolean;
    hasSID: boolean;
    lastModified: string | null;
    ageHours: number | null;
  };
  browser: { active: boolean };
  vnc: { active: boolean };
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

export interface CookieStatus {
  isValid: boolean;
  cookieCount: number;
  cookieNames: string[];
  hasPSID: boolean;
  hasSID: boolean;
  lastModified: string | null;
}

export interface CookieAction {
  success: boolean;
  cookieCount?: number;
  cookieNames?: string[];
  isLoggedIn?: boolean;
  timestamp?: string;
  error?: string;
}

export interface SetupResponse {
  url: string;
  instructions: string;
}

export interface BrowserCloseResponse {
  message: string;
  cookieRefresh: { success: boolean; cookieCount?: number };
}

export async function getHealth(): Promise<BotHealth> {
  return request<BotHealth>("/health");
}

export async function getStatus(): Promise<BotStatus> {
  return request<BotStatus>("/api/status");
}

export async function getCookieStatus(): Promise<CookieStatus> {
  return request<CookieStatus>("/api/cookies/status");
}

export async function refreshCookies(): Promise<CookieAction> {
  return request<CookieAction>("/api/cookies/refresh", { method: "POST" });
}

export async function extractCookies(): Promise<CookieAction> {
  return request<CookieAction>("/api/cookies/extract", { method: "POST" });
}

export async function setupVNC(): Promise<SetupResponse> {
  return request<SetupResponse>("/api/cookies/setup", { method: "POST" });
}

export async function stopVNC(): Promise<{ message: string }> {
  return request<{ message: string }>("/api/cookies/setup/stop", { method: "POST" });
}

export async function startBrowser(): Promise<{ message: string }> {
  return request<{ message: string }>("/api/browser/start", { method: "POST" });
}

export async function closeBrowser(): Promise<BrowserCloseResponse> {
  return request<BrowserCloseResponse>("/api/browser/close", { method: "POST" });
}

export async function resetProfile(): Promise<{ message: string }> {
  return request<{ message: string }>("/api/profile/reset", { method: "POST" });
}
