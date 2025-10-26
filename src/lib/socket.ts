import { io, Socket } from 'socket.io-client';
import { config } from './config/env.js';
import { gameActions } from './stores/game.js';

class SocketService {
	private socket: Socket | null = null;
	private roomCode: string | null = null;
	private username: string | null = null;

	connect() {
		if (this.socket?.connected) return;

		this.socket = io(config.apiBaseUrl, {
			transports: ['polling', 'websocket'],
			autoConnect: true,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5
		});

		this.setupListeners();
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
		this.roomCode = null;
		this.username = null;
	}

	private setupListeners() {
		if (!this.socket) return;

		// Conexión establecida
		this.socket.on('connect', () => {
			console.log('✅ Conectado al servidor Socket.IO');
		});

		// Error de conexión
		this.socket.on('connect_error', (error) => {
			console.error('❌ Error de conexión:', error);
			gameActions.setError('Error de conexión con el servidor');
		});

		// Desconexión
		this.socket.on('disconnect', (reason) => {
			console.warn('⚠️ Desconectado:', reason);
		});

		// Confirmación de conexión
		this.socket.on('connected', (data) => {
			console.log('📡', data.message);
		});

		// Jugador se unió
		this.socket.on('player_joined', (data) => {
			console.log('👤 Jugador se unió:', data.username);
			gameActions.updatePlayers(data.players);
			// Preservar el creator si no viene en room_info
			if (data.room_info && !data.room_info.creator) {
				// No actualizar roomInfo si no tiene creator, solo actualizar jugadores
				console.log('Skipping roomInfo update to preserve creator');
			} else {
				gameActions.updateRoomInfo(data.room_info);
			}
		});

		// Jugador salió
		this.socket.on('player_left', (data) => {
			console.log('👋 Jugador salió:', data.username);
			gameActions.removePlayerByUsername(data.username);
		});

		// Juego iniciado
		this.socket.on('game_started', (data) => {
			console.log('🎮 Juego iniciado');
			gameActions.startGame(data);
		});

		// Nuevo turno
		this.socket.on('new_turn', (data) => {
			console.log('🔄 Nuevo turno:', data.player);
			gameActions.updateTurn(data);
		});

		// Palabra aceptada
		this.socket.on('word_accepted', (data) => {
			console.log('✅ Palabra aceptada:', data.word);
			gameActions.wordAccepted(data);
		});

		// Palabra rechazada
		this.socket.on('word_rejected', (data) => {
			console.log('❌ Palabra rechazada:', data.word, '-', data.reason);
			gameActions.wordRejected(data);
		});

		// Timeout del jugador
		this.socket.on('player_timeout', (data) => {
			console.log('⏰ Timeout:', data.username);
			gameActions.playerTimeout(data);
		});

		// Jugador eliminado
		this.socket.on('player_eliminated', (data) => {
			console.log('💀 Jugador eliminado:', data.username);
			gameActions.playerEliminated(data);
		});

		// Juego terminado
		this.socket.on('game_ended', (data) => {
			console.log('🏆 Juego terminado. Ganador:', data.winner);
			gameActions.endGame(data);
		});

		// Mensaje de chat
		this.socket.on('chat_message', (data) => {
			console.log('💬', data.username + ':', data.message);
			gameActions.addChatMessage(data);
		});

		// Estado de la sala
		this.socket.on('room_state', (data) => {
			console.log('📊 Estado de la sala recibido');
			gameActions.updateRoomState(data);
		});

		// Error
		this.socket.on('error', (data) => {
			console.error('⚠️ Error del servidor:', data.message);
			gameActions.setError(data.message);
		});

		// Jugador escribiendo
		this.socket.on('player_typing', (data) => {
			gameActions.updatePlayerTyping(data.username, data.word);
		});
	}

	// Métodos para emitir eventos
	joinRoom(roomCode: string, username: string) {
		if (!this.socket) {
			console.error('Socket no conectado');
			return;
		}

		this.roomCode = roomCode;
		this.username = username;

		this.socket.emit('join_room', {
			room_code: roomCode,
			username: username
		});
	}

	leaveRoom() {
		if (!this.socket || !this.roomCode || !this.username) return;

		this.socket.emit('leave_room', {
			room_code: this.roomCode,
			username: this.username
		});

		this.roomCode = null;
		this.username = null;
	}

	startGame() {
		if (!this.socket || !this.roomCode || !this.username) return;

		this.socket.emit('start_game', {
			room_code: this.roomCode,
			username: this.username
		});
	}

	submitWord(word: string) {
		if (!this.socket || !this.roomCode || !this.username) return;

		this.socket.emit('submit_word', {
			room_code: this.roomCode,
			username: this.username,
			word: word.trim().toUpperCase()
		});
	}

	sendMessage(message: string) {
		if (!this.socket || !this.roomCode || !this.username) return;

		this.socket.emit('send_message', {
			room_code: this.roomCode,
			username: this.username,
			message: message.trim()
		});
	}

	getRoomState() {
		if (!this.socket || !this.roomCode) return;

		this.socket.emit('get_room_state', {
			room_code: this.roomCode
		});
	}

	isConnected(): boolean {
		return this.socket?.connected ?? false;
	}

	getCurrentRoom(): string | null {
		return this.roomCode;
	}

	getCurrentUsername(): string | null {
		return this.username;
	}

	sendTyping(word: string) {
		if (!this.socket || !this.roomCode || !this.username) return;

		this.socket.emit('typing_word', {
			room_code: this.roomCode,
			username: this.username,
			word: word
		});
	}
}

// Exportar instancia única (singleton)
export const socketService = new SocketService();
