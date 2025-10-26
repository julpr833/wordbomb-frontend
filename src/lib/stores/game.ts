import { writable } from 'svelte/store';

export interface Player {
	username: string;
	points: number;
	lives?: number;
	isAlive?: boolean;
	avatar?: string;
}

export interface Prompt {
	type: string;
	value: string;
	description: string;
}

export interface TurnData {
	player: string;
	player_index: number;
	prompt: Prompt;
	time_limit: number;
	round: number;
	lives: Record<string, number>;
}

export interface ChatMessage {
	username: string;
	message: string;
	timestamp: number;
}

export interface GameEndData {
	winner: string;
	final_scores: Array<{
		username: string;
		points: number;
		lives: number;
	}>;
	total_rounds: number;
	total_words: number;
}

export interface RoomInfo {
	code: string;
	gamemode: number;
	difficulty: number;
	lives: number;
	max_players: number;
	state: string;
	creator?: string;
}

export interface GameState {
	// Room info
	roomCode: string | null;
	roomInfo: RoomInfo | null;
	creator: string | null;
	
	// Players
	players: Player[];
	
	// Game state
	gameStatus: 'waiting' | 'playing' | 'finished';
	currentPlayer: string | null;
	currentPrompt: Prompt | null;
	timeLimit: number;
	currentRound: number;
	
	// Turn timer
	turnStartTime: number | null;
	timeRemaining: number;
	
	// Chat
	chatMessages: ChatMessage[];
	
	// Game end
	gameEndData: GameEndData | null;
	
	// UI state
	isLoading: boolean;
	error: string | null;
	lastWordSubmitted: string | null;
	lastWordStatus: 'accepted' | 'rejected' | null;
	lastWordReason: string | null;
	
	// Typing indicator
	playerTyping: { username: string; word: string } | null;
}

// Crear el store del juego
export const gameStore = writable<GameState>({
	roomCode: null,
	roomInfo: null,
	creator: null,
	players: [],
	gameStatus: 'waiting',
	currentPlayer: null,
	currentPrompt: null,
	timeLimit: 15,
	currentRound: 0,
	turnStartTime: null,
	timeRemaining: 0,
	chatMessages: [],
	gameEndData: null,
	isLoading: false,
	error: null,
	lastWordSubmitted: null,
	lastWordStatus: null,
	lastWordReason: null,
	playerTyping: null
});

// Acciones del juego
export const gameActions = {
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

	setRoomCode: (code: string) => {
		gameStore.update((state) => ({
			...state,
			roomCode: code
		}));
	},

	updatePlayers: (players: Player[]) => {
		gameStore.update((state) => ({
			...state,
			players
		}));
	},

	updateRoomInfo: (roomInfo: RoomInfo) => {
		gameStore.update((state) => ({
			...state,
			roomInfo,
			creator: roomInfo.creator || state.creator,
			gameStatus: roomInfo.state === 'playing' ? 'playing' : 'waiting'
		}));
	},

	removePlayerByUsername: (username: string) => {
		gameStore.update((state) => ({
			...state,
			players: state.players.filter((p) => p.username !== username)
		}));
	},

	startGame: (data: any) => {
		gameStore.update((state) => ({
			...state,
			gameStatus: 'playing',
			players: data.players,
			currentRound: 1
		}));
	},

	updateTurn: (data: TurnData) => {
		gameStore.update((state) => ({
			...state,
			currentPlayer: data.player,
			currentPrompt: data.prompt,
			timeLimit: data.time_limit,
			currentRound: data.round,
			turnStartTime: Date.now(),
			timeRemaining: data.time_limit,
			lastWordSubmitted: null,
			lastWordStatus: null,
			lastWordReason: null,
			// Update player lives
			players: state.players.map((p) => ({
				...p,
				lives: data.lives[p.username] ?? p.lives,
				isAlive: (data.lives[p.username] ?? 0) > 0
			}))
		}));
	},

	wordAccepted: (data: any) => {
		gameStore.update((state) => ({
			...state,
			lastWordSubmitted: data.word,
			lastWordStatus: 'accepted',
			lastWordReason: null,
			players: state.players.map((p) =>
				p.username === data.username ? { ...p, points: data.total_points } : p
			)
		}));
	},

	wordRejected: (data: any) => {
		gameStore.update((state) => ({
			...state,
			lastWordSubmitted: data.word,
			lastWordStatus: 'rejected',
			lastWordReason: data.reason,
			players: state.players.map((p) =>
				p.username === data.username ? { ...p, lives: data.lives_remaining } : p
			)
		}));
	},

	playerTimeout: (data: any) => {
		gameStore.update((state) => ({
			...state,
			players: state.players.map((p) =>
				p.username === data.username
					? { ...p, lives: data.lives_remaining, isAlive: data.lives_remaining > 0 }
					: p
			)
		}));
	},

	playerEliminated: (data: any) => {
		gameStore.update((state) => ({
			...state,
			players: state.players.map((p) =>
				p.username === data.username ? { ...p, lives: 0, isAlive: false } : p
			)
		}));
	},

	endGame: (data: GameEndData) => {
		gameStore.update((state) => ({
			...state,
			gameStatus: 'finished',
			gameEndData: data,
			currentPlayer: null,
			currentPrompt: null
		}));
	},

	addChatMessage: (data: ChatMessage) => {
		gameStore.update((state) => ({
			...state,
			chatMessages: [...state.chatMessages, data]
		}));
	},

	updateRoomState: (data: any) => {
		gameStore.update((state) => ({
			...state,
			roomCode: data.room_code,
			players: data.players,
			gameStatus: data.state === 'playing' ? 'playing' : 'waiting',
			roomInfo: {
				code: data.room_code,
				gamemode: data.gamemode,
				difficulty: data.difficulty,
				lives: data.lives,
				max_players: data.max_players,
				state: data.state
			},
			...(data.game_state && {
				currentPlayer: data.game_state.current_player,
				currentPrompt: data.game_state.current_prompt,
				currentRound: data.game_state.round
			})
		}));
	},

	updateTimeRemaining: (time: number) => {
		gameStore.update((state) => ({
			...state,
			timeRemaining: time
		}));
	},

	leaveRoom: () => {
		gameStore.update(() => ({
			roomCode: null,
			roomInfo: null,
			creator: null,
			players: [],
			gameStatus: 'waiting',
			currentPlayer: null,
			currentPrompt: null,
			timeLimit: 15,
			currentRound: 0,
			turnStartTime: null,
			timeRemaining: 0,
			chatMessages: [],
			gameEndData: null,
			isLoading: false,
			error: null,
			lastWordSubmitted: null,
			lastWordStatus: null,
			lastWordReason: null,
			playerTyping: null
		}));
	},

	updatePlayerTyping: (username: string, word: string) => {
		gameStore.update((state) => ({
			...state,
			playerTyping: word ? { username, word } : null
		}));
	}
};