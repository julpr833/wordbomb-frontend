<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Timer from '$lib/components/Game/Timer.svelte';
	import PromptDisplay from '$lib/components/Game/PromptDisplay.svelte';
	import PlayersList from '$lib/components/Game/PlayersList.svelte';
	import WordInput from '$lib/components/Game/WordInput.svelte';
	import Chat from '$lib/components/Game/Chat.svelte';
	import GameOver from '$lib/components/Game/GameOver.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { gameApi } from '$lib/api/game.js';
	import { socketService } from '$lib/socket.js';
	import { gameStore, gameActions } from '$lib/stores/game.js';
	import { authStore } from '$lib/stores/auth.js';

	let code: string | undefined;
	let isConnecting = true;

	// Obtener el código del parámetro de la URL
	$: code = page.params.roomCode;
	$: error = $gameStore.error;
	$: gameStatus = $gameStore.gameStatus;
	$: players = $gameStore.players;
	$: roomInfo = $gameStore.roomInfo;
	$: currentUsername = $authStore.user?.username;
	$: isCreator = roomInfo && currentUsername && roomInfo.creator === currentUsername;
	
	// Debug logging
	$: if (roomInfo && currentUsername) {
		console.log('Creator check:', {
			currentUsername,
			creator: roomInfo.creator,
			isCreator
		});
	}

	onMount(async () => {
		if (!code || code.length !== 6) {
			gameActions.setError('Código de sala inválido.');
			isConnecting = false;
			return;
		}

		// Esperar a que el auth store termine de cargar
		if ($authStore.isLoading) {
			await new Promise(resolve => {
				const unsubscribe = authStore.subscribe(state => {
					if (!state.isLoading) {
						unsubscribe();
						resolve(null);
					}
				});
			});
		}

		if (!$authStore.isAuthenticated || !$authStore.user?.username) {
			gameActions.setError('Debes iniciar sesión para unirte a una sala.');
			isConnecting = false;
			return;
		}

		const currentUsername = $authStore.user.username;

		try {
			// Limpiar cualquier error previo
			gameActions.setError(null);
			
			// Validar la existencia de la sala en el backend
			const response = await gameApi.joinRoom(code);
			console.log('Join room response:', response);

			if (!response.success) {
				throw new Error(response.message || 'No se pudo unir a la sala.');
			}

			const roomData: any = response.data?.room;
			console.log('Room data:', roomData);
			console.log('Creator from roomData:', roomData.creator);
			
			if (!roomData) {
				throw new Error('No se recibió información de la sala.');
			}
			
			// Actualizar el store con la información de la sala
			gameActions.setRoomCode(code);
			gameActions.updatePlayers(roomData.players || []);
			
			const roomInfoToUpdate = {
				code: roomData.code || code,
				gamemode: roomData.gamemode || 1,
				difficulty: roomData.difficulty || 2,
				lives: roomData.lives || 3,
				max_players: roomData.max_players || 4,
				state: roomData.state || 'waiting',
				creator: roomData.creator
			};
			
			console.log('Updating roomInfo with:', roomInfoToUpdate);
			gameActions.updateRoomInfo(roomInfoToUpdate);

			// Conectar al Socket.IO
			socketService.connect();
			
			// Esperar un momento para que se establezca la conexión
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// Unirse a la sala
			socketService.joinRoom(code, currentUsername);

			isConnecting = false;
		} catch (e: any) {
			console.error('Error en join room:', e);
			
			// Si el error es "Ya te encuentras en una sala", intentar conectar de todas formas
			if (e.error === 'Ya te encuentras en una sala.' || e.message?.includes('Ya te encuentras')) {
				console.log('Usuario ya en sala, conectando Socket.IO de todas formas...');
				
				// Conectar al Socket.IO de todas formas
				socketService.connect();
				await new Promise(resolve => setTimeout(resolve, 500));
				socketService.joinRoom(code, currentUsername);
				
				// Obtener el estado de la sala vía Socket.IO
				socketService.getRoomState();
				
				isConnecting = false;
			} else {
				gameActions.setError(e.error || e.message || 'Error al unirse a la sala.');
				isConnecting = false;
			}
		}
	});

	onDestroy(() => {
		// Limpiar al salir
		if (code && currentUsername) {
			socketService.leaveRoom();
		}
	});

	function leaveRoom() {
		socketService.leaveRoom();
		socketService.disconnect();
		gameActions.leaveRoom();
		goto('/room-manager');
	}

	function startGame() {
		socketService.startGame();
	}
</script>

<svelte:head>
	<title>Sala {code} - Wordbomb</title>
</svelte:head>

<Header showReturn={true} />

<div class="min-h-screen bg-gradient-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] py-8">
	{#if isConnecting}
		<div class="container mx-auto max-w-2xl px-4 text-center">
			<div class="rounded-lg bg-[#1E3E62] p-8 shadow-lg">
				<div class="mb-4 text-6xl">⏳</div>
				<p class="font-display text-xl text-white/70">Conectando a la sala...</p>
			</div>
		</div>
	{:else if error}
		<div class="container mx-auto max-w-2xl px-4 text-center">
			<div class="rounded-lg bg-[#1E3E62] p-6 text-red-400 shadow-lg">
				<p class="mb-4 font-display text-lg">{error}</p>
				<button
					on:click={() => goto('/room-manager')}
					class="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
				>
					Volver
				</button>
			</div>
		</div>
	{:else if gameStatus === 'waiting'}
		<!-- Sala de espera -->
		<div class="container mx-auto max-w-4xl px-4">
			<div class="mb-6 text-center">
				<h1 class="mb-2 font-display-header text-5xl text-orange-400">
					Sala {code}
				</h1>
				<p class="font-display text-lg text-white/70">Esperando jugadores...</p>
			</div>

			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Lista de jugadores -->
				<PlayersList />

				<!-- Información de la sala -->
				<div class="rounded-lg bg-[#1E3E62] p-6 shadow-lg">
					<h3 class="mb-4 font-display-header text-xl text-orange-400">Configuración</h3>
					
					{#if roomInfo}
						<div class="space-y-3 text-left">
							<div class="flex justify-between rounded-lg bg-[#0B192C] p-3">
								<span class="font-display text-white/70">Modo de Juego:</span>
								<span class="font-display-header font-bold text-white">
									{roomInfo.gamemode === 1 ? 'Clásico' : roomInfo.gamemode === 2 ? 'Inverso' : 'Hardcore'}
								</span>
							</div>
							<div class="flex justify-between rounded-lg bg-[#0B192C] p-3">
								<span class="font-display text-white/70">Dificultad:</span>
								<span class="font-display-header font-bold text-white">
									{roomInfo.difficulty === 1 ? 'Fácil' : roomInfo.difficulty === 2 ? 'Normal' : 'Difícil'}
								</span>
							</div>
							<div class="flex justify-between rounded-lg bg-[#0B192C] p-3">
								<span class="font-display text-white/70">Vidas:</span>
								<span class="font-display-header font-bold text-white">{roomInfo.lives}</span>
							</div>
							<div class="flex justify-between rounded-lg bg-[#0B192C] p-3">
								<span class="font-display text-white/70">Jugadores:</span>
								<span class="font-display-header font-bold text-white">
									{players.length}/{roomInfo.max_players}
								</span>
							</div>
						</div>
					{/if}

					<div class="mt-6 space-y-3">
						{#if isCreator}
							<button
								on:click={startGame}
								disabled={players.length < 2}
								class="w-full rounded-lg bg-green-500 px-6 py-3 font-display-header text-lg font-bold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{players.length < 2 ? 'Esperando jugadores...' : 'Iniciar Juego'}
							</button>
						{:else}
							<div class="rounded-lg bg-[#0B192C] p-4 text-center">
								<p class="font-display text-white/70">Esperando que el host inicie el juego...</p>
							</div>
						{/if}

						<button
							on:click={leaveRoom}
							class="w-full rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-600"
						>
							Salir de la Sala
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else if gameStatus === 'playing'}
		<!-- Juego en curso -->
		<div class="container mx-auto max-w-7xl px-4">
			<div class="mb-4 text-center">
				<h1 class="font-display-header text-3xl text-orange-400">
					Ronda {$gameStore.currentRound}
				</h1>
			</div>

			<div class="grid gap-6 lg:grid-cols-3">
				<!-- Columna izquierda: Jugadores -->
				<div class="space-y-6">
					<PlayersList />
					
					<button
						on:click={leaveRoom}
						class="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
					>
						Abandonar
					</button>
				</div>

				<!-- Columna central: Juego -->
				<div class="space-y-6">
					<Timer />
					<PromptDisplay />
					<WordInput />
				</div>

				<!-- Columna derecha: Chat -->
				<div class="h-[600px]">
					<Chat />
				</div>
			</div>
		</div>
	{/if}

	<!-- Modal de fin de juego -->
	<GameOver />
</div>
