import { api } from '../api.js';

// INTERFAZ PARA LOS DATOS DE ENTRADA (lo que el formulario enviará)
// Nombres en snake_case para coincidir con tu API de Flask (request.form)
// src/lib/api/game.ts
export interface CreateRoomData {
	max_players: number;
	lives: number;
	difficulty: number;
	game_mode: number;
}

// INTERFAZ PARA LA RESPUESTA (lo que tu API de Flask devuelve)
export interface CreateRoomResponse {
	success: string;
	room_code: string;
}

/* --- Tus otras interfaces (se mantienen para futuros métodos) --- */
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
/* --- Fin de otras interfaces --- */

// Funciones de API para el juego
export const gameApi = {
	/**
	 * Llama a la API para crear una nueva sala.
	 * Coincide con tu endpoint de Flask /create-room
	 */
	createRoom: async (roomData: CreateRoomData): Promise<CreateRoomResponse> => {
		return api.post<CreateRoomResponse>('/game/create-room', roomData, {
			useFormData: true // Envía como 'request.form'
		});
	},

	joinRoom: async (roomCode: string): Promise<JoinRoomResponse> => {
		return api.post<JoinRoomResponse>(
			'/game/join-room',
			{ room_code: roomCode },
			{
				useFormData: true
			}
		);
	},

	getRoom: async (roomCode: string): Promise<RoomResponse> => {
		return api.get<RoomResponse>(`/game/room/${roomCode}`);
	},

	leaveRoom: async (roomCode: string): Promise<{ success: boolean; message: string }> => {
		return api.post<{ success: boolean; message: string }>(
			'/game/leave-room',
			{ roomCode },
			{
				useFormData: true
			}
		);
	},

	startGame: async (roomCode: string): Promise<{ success: boolean; message: string }> => {
		return api.post<{ success: boolean; message: string }>(
			'/game/start',
			{ roomCode },
			{
				useFormData: true
			}
		);
	}
};
