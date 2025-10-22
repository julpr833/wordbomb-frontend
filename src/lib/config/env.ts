// Configuración del entorno
export const config = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7777',
	isDevelopment: import.meta.env.DEV === true,
	isProduction: import.meta.env.PROD === true
} as const;

export type Config = typeof config;