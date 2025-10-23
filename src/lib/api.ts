import { config } from './config/env.js';
import { goto } from '$app/navigation';

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
}

export interface ApiError {
	error?: string;
	message?: string;
}

// Función genérica para hacer peticiones a la API usando SvelteKit
export async function apiRequest<T>(
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	endpoint: string,
	data?: any,
	options?: {
		useFormData?: boolean;
		headers?: Record<string, string>;
	}
): Promise<T> {
	const url = `${config.apiBaseUrl}${endpoint}`;

	let headers: Record<string, string> = {};
	let body: string | FormData | undefined;

	// Agregar token de auth si está disponible (solo en el navegador)
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('auth_token');
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
	}

	if (data) {
		if (options?.useFormData) {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				formData.append(key, value as string);
			});
			body = formData;
		} else {
			headers['Content-Type'] = 'application/json';
			body = JSON.stringify(data);
		}
	}

	// Combinar headers personalizados
	if (options?.headers) {
		headers = { ...headers, ...options.headers };
	}

	try {
		const response = await fetch(url, {
			method,
			headers,
			body
		});

		if (!response.ok) {
			const errorData: ApiError = await response.json().catch(() => ({}));

			if (response.status === 401) {
				// Token expirado o inválido, limpiar auth (solo en el navegador)
				if (typeof window !== 'undefined') {
					localStorage.removeItem('auth_token');
					localStorage.removeItem('user_data');
					await goto('/');
					location.reload();
				}
			}

			console.error(`API ${method} ${endpoint} error:`, errorData);
			throw errorData.error || errorData;
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
}

// Funciones de conveniencia para diferentes métodos HTTP
export const api = {
	get: <T>(endpoint: string, options?: { headers?: Record<string, string> }) =>
		apiRequest<T>('GET', endpoint, undefined, options),

	post: <T>(
		endpoint: string,
		data?: any,
		options?: { useFormData?: boolean; headers?: Record<string, string> }
	) => apiRequest<T>('POST', endpoint, data, options),

	patch: <T>(
		endpoint: string,
		data?: any,
		options?: { useFormData?: boolean; headers?: Record<string, string> }
	) => apiRequest<T>('PATCH', endpoint, data, options),

	delete: <T>(
		endpoint: string,
		data?: any,
		options?: { useFormData?: boolean; headers?: Record<string, string> }
	) => apiRequest<T>('DELETE', endpoint, data, options)
};
