import { writable } from 'svelte/store';

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

export interface GameState {
	currentRoom: Room | null;
	isInRoom: boolean;
	isLoading: boolean;
	error: string | null;
}

// Crear el store del juego
export const gameStore = writable<GameState>({
	currentRoom: null,
	isInRoom: false,
	isLoading: false,
	error: null
});

// Acciones del juego
export const gameActions = {
	setRoom: (room: Room | null) => {
		gameStore.update((state) => ({
			...state,
			currentRoom: room,
			isInRoom: !!room,
			error: null
		}));
	},

	setLoading: (loading: boolean) => {
		gameStore.update((state) => ({
			...state,
			isLoading: loading
		}));
	},

	setError: (error: string | null) => {
		gameStore.update((state) => ({
			...state,
			error,
			isLoading: false
		}));
	},

	addPlayer: (player: string) => {
		gameStore.update((state) => {
			if (!state.currentRoom) return state;

			return {
				...state,
				currentRoom: {
					...state.currentRoom,
					players: [...state.currentRoom.players, player]
				}
			};
		});
	},

	removePlayer: (player: string) => {
		gameStore.update((state) => {
			if (!state.currentRoom) return state;

			return {
				...state,
				currentRoom: {
					...state.currentRoom,
					players: state.currentRoom.players.filter((p) => p !== player)
				}
			};
		});
	},

	updateRoomStatus: (status: 'waiting' | 'playing' | 'finished') => {
		gameStore.update((state) => {
			if (!state.currentRoom) return state;

			return {
				...state,
				currentRoom: {
					...state.currentRoom,
					status
				}
			};
		});
	},

	leaveRoom: () => {
		gameStore.update((state) => ({
			...state,
			currentRoom: null,
			isInRoom: false,
			error: null
		}));
	}
};