<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { authStore } from '$lib/stores/auth.js';
	import { gameApi } from '$lib/api/game.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Reactive variable for user
	let user: any = null;

	// Subscribe to auth store
	authStore.subscribe((state) => {
		user = state.user;
	});

	let roomData: any = null;
	let isLoading = true;
	let error = '';
	let isHost = false;
	let canStart = false;
	let pollInterval: ReturnType<typeof setInterval>;

	$: roomCode = $page.params.roomCode;

	// Cargar datos de la sala
	async function loadRoomData() {
		try {
			const response = await gameApi.getRoom(roomCode);

			if (response.success && response.data) {
				roomData = response.data.room;
				isHost = roomData.host === user?.username;
				canStart = roomData.players.length >= 2 && roomData.status === 'waiting';
			} else {
				error = response.message || 'Sala no encontrada';
			}
		} catch (err) {
			error = 'Error al cargar la sala';
			console.error('Error loading room:', err);
		} finally {
			isLoading = false;
		}
	}

	// Iniciar juego
	async function startGame() {
		if (!canStart) return;

		try {
			const response = await gameApi.startGame(roomCode);

			if (response.success) {
				// Redirigir al juego
				goto(`/game/${roomCode}`);
			} else {
				error = response.message || 'Error al iniciar el juego';
			}
		} catch (err) {
			error = 'Error al iniciar el juego';
			console.error('Error starting game:', err);
		}
	}

	// Abandonar sala
	async function leaveRoom() {
		try {
			await gameApi.leaveRoom(roomCode);
			goto('/');
		} catch (err) {
			console.error('Error leaving room:', err);
			// Aún así redirigir al inicio
			goto('/');
		}
	}

	// Copiar código de sala
	function copyRoomCode() {
		navigator.clipboard.writeText(roomCode);
		// Aquí podrías mostrar una notificación de que se copió
	}

	// Polling para actualizar datos de la sala
	function startPolling() {
		pollInterval = setInterval(loadRoomData, 2000); // Actualizar cada 2 segundos
	}

	function stopPolling() {
		if (pollInterval) {
			clearInterval(pollInterval);
		}
	}

	onMount(() => {
		loadRoomData();
		startPolling();
	});

	onDestroy(() => {
		stopPolling();
	});
</script>

<svelte:head>
	<title>Sala {roomCode} - Wordbomb</title>
	<meta name="description" content="Sala de juego Wordbomb" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
	{#if isLoading}
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-white text-lg">Cargando sala...</p>
		</div>
	{:else if error}
		<div class="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center">
			<div class="text-red-400 text-6xl mb-4">⚠️</div>
			<h2 class="text-white text-xl font-semibold mb-4">Error</h2>
			<p class="text-red-300 mb-6">{error}</p>
			<button
				on:click={() => goto('/')}
				class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
			>
				Volver al Inicio
			</button>
		</div>
	{:else if roomData}
		<div class="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full">
			<!-- Header con bomba y código de sala -->
			<div class="flex items-center justify-between mb-8">
				<div class="flex items-center space-x-4">
					<div class="w-16 h-16 bg-black rounded-full flex items-center justify-center">
						<div class="w-8 h-8 bg-gray-700 rounded-full relative">
							<div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-orange-500 rounded-full"></div>
							<div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-400 rounded-full"></div>
						</div>
					</div>
					<h1 class="text-4xl font-bold text-orange-500">WORDBOMB</h1>
				</div>

				<div class="text-center">
					<p class="text-white text-sm mb-2">Código de sala</p>
					<div class="flex items-center space-x-2">
						<span class="px-4 py-2 bg-orange-500 text-white rounded-lg font-mono text-lg">{roomCode}</span>
						<button
							on:click={copyRoomCode}
							class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							title="Copiar código"
						>
							📋
						</button>
					</div>
				</div>
			</div>

			<!-- Información de la sala -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				<!-- Configuración -->
				<div class="bg-blue-700/50 rounded-xl p-6">
					<h2 class="text-white text-xl font-semibold mb-4">Configuración de la Sala</h2>

					<div class="space-y-4">
						<div class="flex justify-between">
							<span class="text-white">Jugadores:</span>
							<span class="text-orange-400 font-semibold">{roomData.players.length}/{roomData.maxPlayers}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-white">Vidas:</span>
							<span class="text-orange-400 font-semibold">{roomData.lives}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-white">Dificultad:</span>
							<span class="text-orange-400 font-semibold">{roomData.difficulty}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-white">Modo:</span>
							<span class="text-orange-400 font-semibold">{roomData.gameMode}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-white">Estado:</span>
							<span class="text-orange-400 font-semibold capitalize">{roomData.status}</span>
						</div>
					</div>
				</div>

				<!-- Lista de jugadores -->
				<div class="bg-blue-700/50 rounded-xl p-6">
					<h2 class="text-white text-xl font-semibold mb-4">Jugadores ({roomData.players.length})</h2>

					<div class="space-y-2">
						{#each roomData.players as player, index}
							<div class="flex items-center justify-between bg-blue-600/50 rounded-lg p-3">
								<div class="flex items-center space-x-3">
									<div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
										{index + 1}
									</div>
									<span class="text-white font-medium">{player}</span>
									{#if player === roomData.host}
										<span class="text-yellow-400 text-xs font-semibold">(Host)</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Botones de acción -->
			<div class="flex justify-center space-x-4">
				{#if isHost && canStart}
					<button
						on:click={startGame}
						class="px-8 py-4 bg-orange-500 text-white text-xl font-bold rounded-xl hover:bg-orange-600 transition-colors"
					>
						INICIAR JUEGO
					</button>
				{:else if isHost}
					<button
						disabled
						class="px-8 py-4 bg-gray-500 text-white text-xl font-bold rounded-xl cursor-not-allowed"
					>
						Esperando más jugadores...
					</button>
				{:else}
					<button
						disabled
						class="px-8 py-4 bg-gray-500 text-white text-xl font-bold rounded-xl cursor-not-allowed"
					>
						Esperando al host...
					</button>
				{/if}

				<button
					on:click={leaveRoom}
					class="px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
				>
					Abandonar Sala
				</button>
			</div>
		</div>
	{/if}
</div>
