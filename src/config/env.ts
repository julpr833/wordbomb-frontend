// Environment configuration
export const config = {
  apiBaseUrl:
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:7777",
  isDevelopment: (import.meta as any).env?.DEV === true,
  isProduction: (import.meta as any).env?.PROD === true,
} as const;

export type Config = typeof config;
