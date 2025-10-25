import { api } from '../api.js';

export interface BanUserResponse {
	message?: string;
	error?: string;
}

export interface Player {
	id: number;
	username: string;
	email: string;
	registration_date: string;
	status: string; // "ACTIVO" | "BANEADO"
}

export interface GetAllPlayersResponse {
	players: Player[];
	error?: string;
}

export const adminApi = {
	banUser: async (id: string, ban: boolean): Promise<BanUserResponse> => {
		return api.patch<BanUserResponse>(
			'/api/users/ban',
			{
				id: id,
				ban: ban ? 1 : 0
			},
			{
				useFormData: true
			}
		);
	},

	getAllPlayers: async (): Promise<GetAllPlayersResponse> => {
		return api.get<GetAllPlayersResponse>('/api/users/get-all');
	}
};
