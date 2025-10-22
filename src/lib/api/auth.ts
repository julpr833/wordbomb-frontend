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

export interface AuthResponse {
	user?: User;
	token?: string;
}

// Funciones de API para autenticación
export const authApi = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		console.log('Enviando datos de login:', {
			username: credentials.username,
			password: '[OCULTO]'
		});

		return api.post<AuthResponse>('/api/auth/login', credentials, {
			useFormData: true
		});
	},

	register: async (userData: RegisterRequest): Promise<AuthResponse> => {
		console.log('Enviando datos de registro:', {
			username: userData.username,
			email: userData.email,
			password: '[OCULTO]'
		});

		return api.post<AuthResponse>('/api/auth/register', userData, {
			useFormData: true
		});
	},

	logout: async (): Promise<void> => {
		try {
			await api.post('/api/auth/logout', {});
		} catch (error) {
			console.warn('Falló la petición de logout, pero limpiando auth local:', error);
		}
	},

	verifyToken: async (): Promise<boolean> => {
		try {
			await api.get('/api/auth/verify');
			return true;
		} catch (error) {
			console.error('Error verificando token:', error);
			return false;
		}
	}
};
