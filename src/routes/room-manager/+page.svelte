<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { gameApi } from '$lib/api/game.js';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.js';
	import CreateRoomForm from '$lib/components/Game/CreateRoomForm.svelte';
	import { onMount } from 'svelte';

	let joinCode: string = '';
	let error: string | null = null;
	let isLoading = false;
	// Estado de la vista: 'select' (unir/crear) o 'create' (formulario)
	let mode: 'select' | 'create' = 'select';

	$: isAuthenticated = $authStore.isAuthenticated;
	$: user = $authStore.user;

	onMount(() => {
		// Verificar autenticación al cargar la página
		if (!isAuthenticated) {
			error = 'Debes iniciar sesión para jugar.';
		}
	});

	async function handleJoinRoom() {
		if (!isAuthenticated) {
			error = 'Debes iniciar sesión para unirte a una sala.';
			return;
		}

		const code = joinCode.trim().toUpperCase();

		if (code.length !== 6) {
			error = 'El código debe tener 6 letras.';
			return;
		}

		isLoading = true;
		error = null;

		try {
			// Llama a la API HTTP para unirse a la sala
			const response = await gameApi.joinRoom(code);

			if (response.success) {
				// Éxito: Redirigir a la sala usando el código que ingresamos
				await goto(`/room/${code}`);
			} else {
				// La respuesta falló, el backend devolvió un error (e.g., sala llena)
				throw new Error(response.message || 'Error desconocido al unirse.');
			}
		} catch (e: any) {
			console.error('Error en joinRoom:', e);
			
			// Manejo específico para el error "Ya te encuentras en una sala"
			if (e.error === 'Ya te encuentras en una sala.') {
				// Intentar obtener el código de la sala actual desde las cookies
				const currentRoomCode = document.cookie
					.split('; ')
					.find(row => row.startsWith('ROOM='))
					?.split('=')[1];
				
				if (currentRoomCode) {
					error = `Ya estás en la sala ${currentRoomCode}. ¿Deseas volver a ella?`;
					// Ofrecer redirigir a la sala actual
					setTimeout(() => {
						if (confirm(`Ya estás en la sala ${currentRoomCode}. ¿Deseas ir a esa sala?`)) {
							goto(`/room/${currentRoomCode}`);
						}
					}, 100);
				} else {
					error = 'Ya estás en una sala. Intenta recargar la página o cerrar sesión y volver a entrar.';
				}
			} else {
				// Captura errores de la red o del JSON de error del backend
				error = e.message || e.error || 'Error al unirse a la sala.';
			}
		} finally {
			isLoading = false;
		}
	}

	function handleCreateRoom() {
		if (!isAuthenticated) {
			error = 'Debes iniciar sesión para crear una sala.';
			return;
		}
		mode = 'create';
	}
</script>

<svelte:head>
	<title>Jugar - Wordbomb</title>
</svelte:head>

<Header showReturn={true} />

<div class="min-h-screen bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] py-8">
	<div class="container mx-auto max-w-xl px-4">
		<div class="mb-8 text-center">
			<h1 class="mb-4 font-display-header text-4xl text-orange-400">Jugar</h1>
			<p class="text-white/80">Crea una sala o únete a una existente.</p>
			
			{#if !isAuthenticated}
				<div class="mt-4 rounded-lg bg-red-500/20 border border-red-500/50 p-4">
					<p class="font-display text-red-400">
						⚠️ Debes <a href="/" class="underline hover:text-red-300">iniciar sesión</a> para jugar.
					</p>
				</div>
			{/if}
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
						disabled={!isAuthenticated}
						class=" w-full rounded-lg border border-white/10 bg-[#11243d] p-3 text-center font-display-header text-xl text-white uppercase focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<button
						type="submit"
						disabled={!isAuthenticated || isLoading || joinCode.length !== 6}
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
					on:click={handleCreateRoom}
					disabled={!isAuthenticated}
					class="w-full rounded-lg cursor-pointer bg-[#1E3E62] px-6 py-4 font-medium text-white transition-colors hover:bg-[#243c57] hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
