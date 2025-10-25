<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { gameApi } from '$lib/api/game.js';
	import { goto } from '$app/navigation';
	import CreateRoomForm from '$lib/components/Game/CreateRoomForm.svelte';
	let joinCode: string = '';
	let error: string | null = null;
	let isLoading = false;
	// Estado de la vista: 'select' (unir/crear) o 'create' (formulario)
	let mode: 'select' | 'create' = 'select';

	async function handleJoinRoom() {
		const code = joinCode.trim().toUpperCase();

		if (code.length !== 6) {
			// Asumiendo código de 6 caracteres (como en tu Rooms class)
			error = 'El código debe tener 6 letras.';
			return;
		}

		isLoading = true;
		error = null;

		try {
			// Llama a la API HTTP para unirse a la sala
			const response = await gameApi.joinRoom(code);

			if (response.success && response.data?.room.code) {
				// Éxito: Redirigir a la sala. La conexión WebSocket se hará en la nueva página.
				await goto(`/sala/${response.data.room.code}`);
			} else {
				// La respuesta falló, el backend devolvió un error (e.g., sala llena)
				throw new Error(response.message || 'Error desconocido al unirse.');
			}
		} catch (e: any) {
			console.error('Error en joinRoom:', e);
			// Captura errores de la red o del JSON de error del backend
			error =
				e.response?.data?.error || e.message || 'Error al unirse a la sala. Verifica el código.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Jugar - Wordbomb</title>
</svelte:head>

<Header showReturn={true} />

<div class="min-h-screen bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] py-8">
	<div class="container mx-auto max-w-xl px-4">
		<div class="mb-8 text-center">
			<h1 class="mb-4 font-display-header text-4xl text-orange-400">Wordbomb 💣</h1>
			<p class="text-white/80">Crea una sala o únete a una existente.</p>
		</div>

		{#if mode === 'select'}
			<div
				class="mb-8 rounded-lg bg-linear-to-br from-[#1E3E62] to-[#243c57] p-6 text-center shadow-lg"
			>
				<h2 class="mb-4 font-display text-2xl text-orange-400">Unirse a una Sala</h2>
				<form on:submit|preventDefault={handleJoinRoom} class="flex flex-col gap-4">
					<input
						type="text"
						bind:value={joinCode}
						placeholder="Introduce el código de 6 letras"
						maxlength="6"
						required
						class=" w-full rounded-lg border border-white/10 bg-[#11243d] p-3 text-center font-display-header text-xl text-white uppercase focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
					/>
					<button
						type="submit"
						disabled={isLoading || joinCode.length !== 6}
						class="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-800 disabled:opacity-70"
					>
						{isLoading ? 'Conectando...' : '¡Unirse!'}
					</button>
				</form>
				{#if error}
					<p class="mt-4 text-center text-red-400">{error}</p>
				{/if}
			</div>

			<div class="relative flex items-center justify-center py-4">
				<div class="h-px w-full bg-white/20"></div>
				<span class="absolute bg-[#11243d] px-4 font-display text-white/80">O</span>
			</div>

			<div class="rounded-lg p-6 text-center">
				<button
					on:click={() => (mode = 'create')}
					class="w-full rounded-lg bg-[#1E3E62] px-6 py-4 font-medium text-white transition-colors hover:bg-[#243c57] hover:text-orange-400"
				>
					Crear Nueva Sala
				</button>
			</div>
		{:else}
			<CreateRoomForm on:back={() => (mode = 'select')} />
		{/if}
	</div>
</div>

<style>
	/* ... (Estilos CSS) ... */
	input[type='text'] {
		letter-spacing: 0.25em;
	}
</style>
