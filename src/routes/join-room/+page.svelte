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

	let roomCode = '';
	let isLoading = false;
	let error = '';

	// Unirse a sala
	async function joinRoom() {
		if (!roomCode.trim()) {
			error = 'El código de sala es requerido';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const username = user?.username || 'Jugador';
			const response = await gameApi.joinRoom(roomCode.toUpperCase(), username);

			if (response.success) {
				// Redirigir a la sala
				goto(`/room/${roomCode.toUpperCase()}`);
			} else {
				error = response.message || 'Error al unirse a la sala';
			}
		} catch (err) {
			error = 'Error de conexión. Intenta nuevamente.';
			console.error('Error joining room:', err);
		} finally {
			isLoading = false;
		}
	}

	// Crear nueva sala
	function createNewRoom() {
		goto('/create-room');
	}

	// Volver al inicio
	function goHome() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Unirse a Sala - Wordbomb</title>
	<meta name="description" content="Unirse a una sala de juego existente" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
	<div class="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full">
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

		<!-- Formulario de unirse -->
		<div class="space-y-6">
			<div>
				<label for="room-code-input" class="block text-white text-sm font-medium mb-2"
					>Código de sala</label
				>
				<input
					id="room-code-input"
					type="text"
					bind:value={roomCode}
					on:input={() => (roomCode = roomCode.toUpperCase())}
					class="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-300"
					placeholder="XSAZJ32"
					maxlength="7"
				/>
			</div>

			<!-- Error message -->
			{#if error}
				<div class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
					<p class="text-red-300 text-sm">{error}</p>
				</div>
			{/if}

			<!-- Botones -->
			<div class="space-y-3">
				<button
					on:click={joinRoom}
					disabled={isLoading || !roomCode.trim()}
					class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
				>
					{isLoading ? 'Uniéndose...' : 'Unirse a Sala'}
				</button>

				<button
					on:click={createNewRoom}
					class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
				>
					Crear Nueva Sala
				</button>

				<button
					on:click={goHome}
					class="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
				>
					Volver al Inicio
				</button>
			</div>
		</div>
	</div>
</div>
