import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export interface User {
	id: string;
	username: string;
	email?: string;
	avatar?: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	isLoading: boolean;
}

// Crear el store de autenticación
export const authStore = writable<AuthState>({
	isAuthenticated: false,
	user: null,
	token: null,
	isLoading: true
});

// Acciones de autenticación
export const authActions = {
	login: (user: User, token: string) => {
		authStore.update((state) => ({
			...state,
			isAuthenticated: true,
			user,
			token,
			isLoading: false
		}));

		// Guardar en localStorage para persistencia (solo en el navegador)
		if (browser) {
			localStorage.setItem('auth_token', token);
			localStorage.setItem('user_data', JSON.stringify(user));

			// También establecer cookie para el servidor
			document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
			document.cookie = `user_data=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
		}
	},

	logout: () => {
		authStore.update((state) => ({
			...state,
			isAuthenticated: false,
			user: null,
			token: null,
			isLoading: false
		}));

		// Limpiar localStorage
		if (browser) {
			localStorage.removeItem('auth_token');
			localStorage.removeItem('user_data');

			// Limpiar cookies
			document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			goto('/');
		}
	},

	initialize: () => {
		if (!browser) return;

		// Verificar datos de auth existentes en localStorage
		const token = localStorage.getItem('auth_token');
		const userData = localStorage.getItem('user_data');

		if (token && userData) {
			try {
				const user = JSON.parse(userData);
				authStore.update((state) => ({
					...state,
					isAuthenticated: true,
					user,
					token,
					isLoading: false
				}));
			} catch (error) {
				console.error('Error parseando datos de usuario guardados:', error);
				// Limpiar datos inválidos
				localStorage.removeItem('auth_token');
				localStorage.removeItem('user_data');
				authStore.update((state) => ({
					...state,
					isLoading: false
				}));
			}
		} else {
			authStore.update((state) => ({
				...state,
				isLoading: false
			}));
		}
	},

	setLoading: (loading: boolean) => {
		authStore.update((state) => ({
			...state,
			isLoading: loading
		}));
	}
};
