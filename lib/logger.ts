function log(level: "error" | "warn" | "info", message: string, ...args: unknown[]) {
  if (level === "error" || process.env.NODE_ENV !== "production") {
    console[level](message, ...args);
  }
}

export const logger = {
  error: (message: string, ...args: unknown[]) => log("error", message, ...args),
  warn: (message: string, ...args: unknown[]) => log("warn", message, ...args),
  info: (message: string, ...args: unknown[]) => log("info", message, ...args),
};
