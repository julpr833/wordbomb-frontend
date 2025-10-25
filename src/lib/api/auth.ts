import { authActions } from '$lib/stores/auth.js';
import { api } from '../api.js';

export interface User {
	id: string;
	username: string;
	email: string;
	avatar?: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	password_confirmation: string;
}

export interface PatchProfileRequest {
	new_username?: string;
	regen_avatar?: string;
	new_password?: string;
	new_pass_confirm?: string;
}

export interface AuthResponse {
	user?: User;
	token?: string;
	success?: boolean;
	message?: string;
}

export interface GetProfileResponse {
	id: string;
	username: string;
	email: string;
	avatar_url: string;
	banned: number;
	registration_date: string;
	role: 1 | 2;
}

export interface GetStatsResponse {
	wins: number;
	winrate: number;
	total_games: number;
}

// Funciones de API para autenticación
export const authApi = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		return api.post<AuthResponse>('/api/auth/login', credentials, {
			useFormData: true
		});
	},

	register: async (userData: RegisterRequest): Promise<AuthResponse> => {
		return api.post<AuthResponse>('/api/auth/signup', userData, {
			useFormData: true
		});
	},

	logout: async (): Promise<void> => {
		try {
			await api.post('/api/auth/logout', {});
		} catch (error) {
			console.warn('Falló la petición de logout, pero limpiando auth local:', error);
		}
		authActions.logout();
	},

	// No implementado.
	verifyToken: async (): Promise<boolean> => {
		try {
			await api.get('/api/auth/verify');
			return true;
		} catch (error) {
			return false;
		}
	},

	regenerateAvatar: async () => {
		try {
			const response = await api.patch<GetProfileResponse>(
				'/api/users/profile',
				{ regen_avatar: 'True' },
				{
					useFormData: true
				}
			);
			return response;
		} catch (error) {
			return false;
		}
	},

	editProfile: async (data: PatchProfileRequest) => {
		try {
			const response = await api.patch<AuthResponse>('/api/users/profile', data, {
				useFormData: true
			});
			authApi.logout();
			return response;
		} catch (error) {
			// Mostrar el error en el front
			throw error;
		}
	},

	deleteAccount: async (data: { password: string }) => {
		try {
			const response = await api.delete<AuthResponse>('/api/users/delete-account', data, {
				useFormData: true
			});
			authActions.logout();
			authApi.logout();
			return response;
		} catch (error) {
			throw error;
		}
	},

	getProfile: async (): Promise<GetProfileResponse | false> => {
		try {
			const response: GetProfileResponse = await api.get('/api/users/profile');
			return response;
		} catch (error) {
			console.error('Error obteniendo perfil:', error);
			return false;
		}
	},

	getStats: async (): Promise<GetStatsResponse | false> => {
		try {
			const response: GetStatsResponse = await api.get('/api/users/stats');
			return response;
		} catch (error) {
			console.error('Error obteniendo estadísticas:', error);
			return false;
		}
	}
};
