<script lang="ts">
	import { gameApi, type CreateRoomData } from '$lib/api/game.js';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Estado del formulario
	let roomData: CreateRoomData = {
		lives: 3,
		max_players: 4,
		game_mode: 1, // Gamemodes.CLASSIC
		difficulty: 2 // Difficulty.NORMAL
	};

	let isLoading = false;
	let error: string | null = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;

		try {
			// Llamar a la API con los datos del formulario
			const response = await gameApi.createRoom(roomData);

			if (response && response.room_code) {
				// Éxito: Redirigir a la sala creada
				await goto(`/room/${response.room_code}`);
			} else {
				throw new Error('No se recibió un código de sala.');
			}
		} catch (e: any) {
			console.error('Error en createRoom:', e);
			
			// Manejo específico para el error "Ya te encuentras en una sala"
			if (e.error === 'Ya te encuentras en una sala.') {
				// Intentar obtener el código de la sala actual desde las cookies
				const currentRoomCode = document.cookie
					.split('; ')
					.find(row => row.startsWith('ROOM='))
					?.split('=')[1];
				
				if (currentRoomCode) {
					error = `Ya estás en la sala ${currentRoomCode}.`;
					// Ofrecer redirigir a la sala actual
					setTimeout(() => {
						if (confirm(`Ya estás en la sala ${currentRoomCode}. ¿Deseas ir a esa sala en lugar de crear una nueva?`)) {
							goto(`/room/${currentRoomCode}`);
						}
					}, 100);
				} else {
					error = 'Ya estás en una sala. Intenta recargar la página o cerrar sesión y volver a entrar.';
				}
			} else {
				// El error puede venir del backend (e.g., e.response.data.error)
				error = e.response?.data?.error || e.error || e.message || 'Error al crear la sala.';
			}
		} finally {
			isLoading = false;
		}
	}

	// Constantes de las opciones (valores numéricos de tus Enums)
	const gameModes = [
		{ value: 1, label: 'Clásico' },
		{ value: 2, label: 'Inverso' },
		{ value: 3, label: 'Hardcore' }
	];

	const difficulties = [
		{ value: 1, label: 'Fácil' },
		{ value: 2, label: 'Normal' },
		{ value: 3, label: 'Difícil' }
	];
</script>

<div class="mb-8 rounded-lg bg-linear-to-br from-[#1E3E62] to-[#243c57] p-6 shadow-xl">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="font-display text-3xl text-orange-400">Configuración de Sala</h2>
		<button
			on:click={() => dispatch('back')}
			class="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
			aria-label="Volver a seleccionar opción"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="game_mode" class="mb-2 block font-display text-lg text-orange-400"
					>Modo de Juego</label
				>
				<select
					id="game_mode"
					bind:value={roomData.game_mode}
					class="w-full rounded-lg border border-white/10 bg-[#11243d] p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				>
					{#each gameModes as mode}
						<option value={mode.value}>{mode.label}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="difficulty" class="mb-2 block font-display text-lg text-orange-400"
					>Dificultad</label
				>
				<select
					id="difficulty"
					bind:value={roomData.difficulty}
					class="w-full rounded-lg border border-white/10 bg-[#11243d] p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				>
					{#each difficulties as diff}
						<option value={diff.value}>{diff.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="mt-6">
			<div class="mb-6">
				<label for="lives" class="mb-2 block font-display text-lg text-orange-400"
					>Vidas: <span class="font-sans text-xl font-bold text-white">{roomData.lives}</span
					></label
				>
				<input
					id="lives"
					type="range"
					bind:value={roomData.lives}
					min="1"
					max="10"
					step="1"
					class="range-slider w-full"
				/>
			</div>

			<div>
				<label for="max_players" class="mb-2 block font-display text-lg text-orange-400"
					>Jugadores: <span class="font-sans text-xl font-bold text-white"
						>{roomData.max_players}</span
					></label
				>
				<input
					id="max_players"
					type="range"
					bind:value={roomData.max_players}
					min="2"
					max="10"
					step="1"
					class="range-slider w-full"
				/>
			</div>
		</div>

		<div class="mt-8 flex flex-col items-center">
			<button
				type="submit"
				disabled={isLoading}
				class="w-full max-w-xs cursor-pointer rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600 disabled:animate-pulse disabled:cursor-not-allowed disabled:bg-orange-800 disabled:opacity-70"
			>
				{isLoading ? 'Creando...' : 'Crear Sala'}
			</button>

			{#if error}
				<p class="mt-4 text-center text-red-400">{error}</p>
			{/if}
		</div>
	</form>
</div>

<style>
	/* ... (Mantener los estilos del slider que definiste en la respuesta anterior) ... */
	.range-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		background: #11243d;
		border-radius: 5px;
		border: 1px solid oklch(31.02% 0.057 265.87 / 0.5);
		outline: none;
	}

	.range-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: oklch(72.58% 0.17 29.63); /* Naranja */
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid oklch(93.62% 0.091 29.58); /* Naranja claro */
		transition: background 0.2s ease;
	}

	.range-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: oklch(72.58% 0.17 29.63); /* Naranja */
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid oklch(93.62% 0.091 29.58); /* Naranja claro */
		transition: background 0.2s ease;
	}

	.range-slider::-webkit-slider-thumb:hover,
	.range-slider::-moz-range-thumb:hover {
		background: oklch(67.7% 0.187 29.66); /* Naranja más oscuro */
	}
</style>
