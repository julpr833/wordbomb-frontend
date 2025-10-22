<script lang="ts">
	import { authActions, authStore } from '$lib/stores/auth.js';
	
	// Estado reactivo del usuario
	$: user = $authStore.user;
</script>

<svelte:head>
	<title>Perfil - Wordbomb</title>
	<meta name="description" content="Perfil de usuario de Wordbomb" />
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] py-8">
	<div class="container mx-auto px-4 max-w-4xl">
		<!-- Header de la página -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-display-header text-orange-400 mb-4">Mi Perfil</h1>
			<p class="text-white/80">Gestiona tu información personal y estadísticas de juego</p>
		</div>

		<!-- Información del usuario -->
		<div class="bg-linear-to-br from-[#1E3E62] to-[#243c57] rounded-lg p-6 mb-6 shadow-lg">
			<div class="flex items-center gap-6">
				<!-- Avatar del usuario -->
				<div class="w-20 h-20 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl">
					{#if user?.avatar}
						<img src={user.avatar} alt={user.username} class="w-20 h-20 rounded-full object-cover" />
					{:else}
						{user?.username?.charAt(0).toUpperCase() || 'U'}
					{/if}
				</div>
				
				<!-- Información básica -->
				<div class="flex-1">
					<h2 class="text-2xl font-display text-orange-400 mb-2">{user?.username || 'Usuario'}</h2>
					{#if user?.email}
						<p class="text-white/70 mb-1">{user.email}</p>
					{/if}
					<p class="text-orange-300/80 text-sm">Miembro desde: {new Date().toLocaleDateString('es-ES')}</p>
				</div>
			</div>
		</div>

		<!-- Estadísticas del juego -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<div class="bg-linear-to-br from-[#1E3E62] to-[#243c57] rounded-lg p-6 text-center shadow-lg">
				<h3 class="text-orange-400 font-display text-lg mb-2">Partidas Jugadas</h3>
				<p class="text-3xl font-bold text-white">0</p>
			</div>
			
			<div class="bg-linear-to-br from-[#1E3E62] to-[#243c57] rounded-lg p-6 text-center shadow-lg">
				<h3 class="text-orange-400 font-display text-lg mb-2">Partidas Ganadas</h3>
				<p class="text-3xl font-bold text-white">0</p>
			</div>
			
			<div class="bg-linear-to-br from-[#1E3E62] to-[#243c57] rounded-lg p-6 text-center shadow-lg">
				<h3 class="text-orange-400 font-display text-lg mb-2">Puntuación Máxima</h3>
				<p class="text-3xl font-bold text-white">0</p>
			</div>
		</div>

		<!-- Botón de logout -->
		<div class="text-center">
			<button
				on:click={() => authActions.logout()}
				class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
			>
				Cerrar Sesión
			</button>
		</div>
	</div>
</div>