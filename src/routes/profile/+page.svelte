<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { authActions, authStore } from '$lib/stores/auth.js';
	import { authApi, type GetProfileResponse, type User } from '$lib/api/auth';
	import { onMount } from 'svelte';
	import EditProfile from '$lib/components/Profile/EditProfile.svelte';

	// Estado reactivo del usuario
	$: user = $authStore.user;

	// Estadisticas
	let stats: { totalGames: number; wins: number; winrate: number } = {
		totalGames: 0,
		wins: 0,
		winrate: 0
	};

	// Estado reactivo de auth
	let isRegeneratingAvatar = false;

	async function regenerateAvatar() {
		// Llamada a la API para generar un nuevo avatar
		isRegeneratingAvatar = true;
		await authApi.regenerateAvatar();

		// Obtener los datos actualizados del usuario
		const userData: GetProfileResponse | false = await authApi.getProfile();
		isRegeneratingAvatar = false;

		if (!userData) return;

		// Actualizar el store de auth
		authActions.reloadUserData({
			id: userData.id,
			username: userData.username,
			email: userData.email,
			avatar: userData.avatar_url
		});
	}

	onMount(async () => {
		// Traer estadisticas
		const statsResponse = await authApi.getStats();

		if (!statsResponse) return;

		// Actualizar estadisticas
		stats = {
			totalGames: statsResponse.total_games,
			wins: statsResponse.wins,
			winrate: statsResponse.winrate
		};
	});
</script>

<svelte:head>
	<title>Perfil - Wordbomb</title>
	<meta name="description" content="Perfil de usuario de Wordbomb" />
</svelte:head>

<Header showReturn={true} />

<div class="min-h-screen bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] py-8">
	<div class="container mx-auto max-w-4xl px-4">
		<!-- Header de la página -->
		<div class="mb-8 text-center">
			<h1 class="mb-4 font-display-header text-4xl text-orange-400">Mi Perfil</h1>
			<p class="text-white/80">Gestiona tu información personal y estadísticas de juego</p>
		</div>

		<!-- Información del usuario -->
		<div class="mb-6 rounded-lg bg-linear-to-br from-[#1E3E62] to-[#243c57] p-6 shadow-lg">
			<div class="flex flex-row items-center gap-6">
				<!-- Avatar del usuario -->
				<div
					class="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white"
				>
					{#if user?.avatar}
						<img
							src={user.avatar}
							alt={user.username}
							class="h-20 w-20 rounded-full object-cover"
						/>
					{:else}
						{user?.username?.charAt(0).toUpperCase() || 'U'}
					{/if}
					<!-- Regenerar avatar -->
					<button
						on:click={regenerateAvatar}
						aria-label="regenerate-avatar"
						disabled={isRegeneratingAvatar}
						class="absolute right-0 bottom-0 scale-75 cursor-pointer rounded-full bg-orange-800 px-0.5 py-0.5 drop-shadow-sm drop-shadow-black/50 disabled:pointer-events-none disabled:animate-spin disabled:opacity-70"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
								d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"
							/><path d="M20 4v5h-5" /></svg
						>
					</button>
				</div>

				<!-- Información básica -->
				<div class="flex-1">
					<h2 class="mb-2 font-display text-2xl text-orange-400">{user?.username || 'Usuario'}</h2>
					{#if user?.email}
						<p class="mb-1 text-white/70">{user.email}</p>
					{/if}
					<p class="text-sm text-orange-300/80">
						Miembro desde: {new Date().toLocaleDateString('es-ES')}
					</p>
				</div>
				<!-- Botón de edición de perfil -->
				<EditProfile />
			</div>
		</div>

		<!-- Estadísticas del juego -->
		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="rounded-lg bg-linear-to-br from-[#1E3E62] to-[#243c57] p-6 text-center shadow-lg">
				<h3 class="mb-2 font-display text-lg text-orange-400">Partidas Jugadas</h3>
				<p class="text-3xl font-bold text-white">{stats.totalGames}</p>
			</div>

			<div class="rounded-lg bg-linear-to-br from-[#1E3E62] to-[#243c57] p-6 text-center shadow-lg">
				<h3 class="mb-2 font-display text-lg text-orange-400">Partidas Ganadas</h3>
				<p class="text-3xl font-bold text-white">{stats.wins}</p>
			</div>

			<div class="rounded-lg bg-linear-to-br from-[#1E3E62] to-[#243c57] p-6 text-center shadow-lg">
				<h3 class="mb-2 font-display text-lg text-orange-400">Winrate</h3>
				<p class="text-3xl font-bold text-white">{stats.winrate.toFixed(2)}%</p>
			</div>
		</div>

		<!-- Botón de logout -->
		<div class="text-center">
			<button
				on:click={() => authActions.logout()}
				class="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
			>
				Cerrar Sesión
			</button>
		</div>
	</div>
</div>
