<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.js';
	import { gameApi } from '$lib/api/game.js';
	import { goto } from '$app/navigation';

	// Reactive variable for user
	let user: any = null;

	// Subscribe to auth store
	authStore.subscribe((state) => {
		user = state.user;
	});

	// Estado del formulario
	let roomCode = '';
	let players = 2;
	let lives = 3;
	let difficulty = 'Media';
	let gameMode = 'Clásico';
	let playersList = ['Mengano']; // Lista de jugadores en la sala
	let isLoading = false;
	let error = '';

	// Opciones disponibles
	const difficultyOptions = ['Fácil', 'Media', 'Difícil'];
	const gameModeOptions = ['Clásico', 'Rápido', 'Extremo'];
	const maxPlayers = 8;
	const minPlayers = 2;

	// Generar código de sala aleatorio
	function generateRoomCode() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 7; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		roomCode = result;
	}

	// Ajustar número de jugadores
	function adjustPlayers(delta: number) {
		const newValue = players + delta;
		if (newValue >= minPlayers && newValue <= maxPlayers) {
			players = newValue;
			// Ajustar lista de jugadores
			if (newValue > playersList.length) {
				for (let i = playersList.length; i < newValue; i++) {
					playersList.push(`Jugador ${i + 1}`);
				}
			} else if (newValue < playersList.length) {
				playersList = playersList.slice(0, newValue);
			}
		}
	}

	// Ajustar vidas
	function adjustLives(delta: number) {
		const newValue = lives + delta;
		if (newValue >= 1 && newValue <= 10) {
			lives = newValue;
		}
	}

	// Ajustar dificultad
	function adjustDifficulty(delta: number) {
		const currentIndex = difficultyOptions.indexOf(difficulty);
		const newIndex = currentIndex + delta;
		if (newIndex >= 0 && newIndex < difficultyOptions.length) {
			difficulty = difficultyOptions[newIndex];
		}
	}

	// Crear sala
	async function createRoom() {
		if (!roomCode.trim()) {
			error = 'El código de sala es requerido';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const roomData = {
				code: roomCode,
				maxPlayers: players,
				lives: lives,
				difficulty: difficulty,
				gameMode: gameMode,
				host: user?.username || 'Host'
			};

			const response = await gameApi.createRoom(roomData);

			if (response.success) {
				// Redirigir a la sala creada
				goto(`/room/${roomCode}`);
			} else {
				error = response.message || 'Error al crear la sala';
			}
		} catch (err) {
			error = 'Error de conexión. Intenta nuevamente.';
			console.error('Error creating room:', err);
		} finally {
			isLoading = false;
		}
	}

	// Unirse a otra sala
	function joinAnotherRoom() {
		goto('/join-room');
	}

	// Generar código al montar el componente
	onMount(() => {
		generateRoomCode();
	});
</script>

<svelte:head>
	<title>Crear Sala - Wordbomb</title>
	<meta name="description" content="Crear una nueva sala de juego" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
	<div class="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full">
		<!-- Header con bomba y título -->
		<div class="flex items-center justify-center mb-8">
			<div class="flex items-center space-x-4">
				<div class="w-16 h-16 bg-black rounded-full flex items-center justify-center">
					<div class="w-8 h-8 bg-gray-700 rounded-full relative">
						<div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-orange-500 rounded-full"></div>
						<div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-400 rounded-full"></div>
					</div>
				</div>
				<h1 class="text-4xl font-bold text-orange-500">WORDBOMB</h1>
			</div>
		</div>

		<!-- Código de sala y botón unirse -->
		<div class="flex items-center justify-between mb-8">
			<div class="flex-1 max-w-xs">
				<label for="room-code-create" class="block text-white text-sm font-medium mb-2"
					>Código de sala</label
				>
				<input
					id="room-code-create"
					type="text"
					bind:value={roomCode}
					class="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-300"
					placeholder="XSAZJ32"
				/>
			</div>
			<button
				on:click={joinAnotherRoom}
				class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
			>
				Unirme a otro
			</button>
		</div>

		<!-- Configuración y jugadores -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Configuración de Sala -->
			<div class="bg-blue-700/50 rounded-xl p-6">
				<h2 class="text-white text-xl font-semibold mb-4">Configuración de Sala</h2>

				<!-- Jugadores -->
				<div class="mb-4">
					<label for="players-control" class="block text-white text-sm font-medium mb-2">Jugadores</label>
					<div class="flex items-center space-x-3" id="players-control">
						<button
							on:click={() => adjustPlayers(-1)}
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
						>
							-
						</button>
						<span class="text-white text-lg font-semibold min-w-[2rem] text-center">{players}</span>
						<button
							on:click={() => adjustPlayers(1)}
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
						>
							+
						</button>
					</div>
				</div>

				<!-- Vidas -->
				<div class="mb-4">
					<label for="lives-control" class="block text-white text-sm font-medium mb-2">Vidas</label>
					<div class="flex items-center space-x-3" id="lives-control">
						<button
							on:click={() => adjustLives(-1)}
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
						>
							-
						</button>
						<span class="text-white text-lg font-semibold min-w-[2rem] text-center">{lives}</span>
						<button
							on:click={() => adjustLives(1)}
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
						>
							+
						</button>
					</div>
				</div>

				<!-- Dificultad -->
				<div class="mb-4">
					<label for="difficulty-control" class="block text-white text-sm font-medium mb-2">Dificultad</label>
					<div class="flex items-center space-x-3" id="difficulty-control">
						<button
							on:click={() => adjustDifficulty(-1)}
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
						>
							-
						</button>
						<span class="text-white text-lg font-semibold min-w-[4rem] text-center">{difficulty}</span>
						<button
							on:click={() => adjustDifficulty(1)}
							class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
						>
							+
						</button>
					</div>
				</div>

				<!-- Modo de Juego -->
				<div>
					<label for="game-mode-select" class="block text-white text-sm font-medium mb-2"
						>Modo de Juego</label
					>
					<select
						id="game-mode-select"
						bind:value={gameMode}
						class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
					>
						{#each gameModeOptions as mode}
							<option value={mode}>{mode}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Lista de Jugadores -->
			<div class="bg-blue-700/50 rounded-xl p-6">
				<h2 class="text-white text-xl font-semibold mb-4">Jugadores en la Sala</h2>
				<div class="space-y-2">
					{#each playersList as player, index}
						<div class="flex items-center justify-between bg-blue-600/50 rounded-lg p-3">
							<div class="flex items-center space-x-3">
								<div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
									-
								</div>
								<span class="text-white font-medium">{player}</span>
							</div>
							{#if index > 0}
								<button
									on:click={() => (playersList = playersList.filter((_, i) => i !== index))}
									class="text-red-400 hover:text-red-300 transition-colors"
								>
									✕
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Error message -->
		{#if error}
			<div class="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
				<p class="text-red-300 text-sm">{error}</p>
			</div>
		{/if}

		<!-- Botón Jugar -->
		<div class="text-center">
			<button
				on:click={createRoom}
				disabled={isLoading}
				class="px-12 py-4 bg-orange-500 text-white text-xl font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{isLoading ? 'Creando...' : 'JUGAR'}
			</button>
		</div>
	</div>
</div>
