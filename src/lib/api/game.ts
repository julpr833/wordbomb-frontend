import { api } from '../api.js';

export interface RoomConfig {
	code: string;
	maxPlayers: number;
	lives: number;
	difficulty: string;
	gameMode: string;
	host: string;
}

export interface Room {
	id: string;
	code: string;
	maxPlayers: number;
	lives: number;
	difficulty: string;
	gameMode: string;
	host: string;
	players: string[];
	status: 'waiting' | 'playing' | 'finished';
	createdAt: string;
}

export interface RoomResponse {
	success: boolean;
	message: string;
	data?: {
		room: Room;
	};
}

export interface JoinRoomResponse {
	success: boolean;
	message: string;
	data?: {
		room: Room;
	};
}

// Funciones de API para el juego
export const gameApi = {
	createRoom: async (roomData: RoomConfig): Promise<RoomResponse> => {
		return api.post<RoomResponse>('/api/game/create-room', roomData, {
			useFormData: true
		});
	},

	joinRoom: async (roomCode: string, username: string): Promise<JoinRoomResponse> => {
		return api.post<JoinRoomResponse>(
			'/api/game/join-room',
			{ roomCode, username },
			{
				useFormData: true
			}
		);
	},

	getRoom: async (roomCode: string): Promise<RoomResponse> => {
		return api.get<RoomResponse>(`/api/game/room/${roomCode}`);
	},

	leaveRoom: async (roomCode: string): Promise<{ success: boolean; message: string }> => {
		return api.post<{ success: boolean; message: string }>(
			'/api/game/leave-room',
			{ roomCode },
			{
				useFormData: true
			}
		);
	},

	startGame: async (roomCode: string): Promise<{ success: boolean; message: string }> => {
		return api.post<{ success: boolean; message: string }>(
			'/api/game/start',
			{ roomCode },
			{
				useFormData: true
			}
		);
	}
};
