<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.js';

	// Props del componente
	export let fallbackUrl = '/';

	// Estado reactivo
	$: isAuthenticated = $authStore.isAuthenticated;
	$: isLoading = $authStore.isLoading;

	// Verificar autenticación al montar el componente
	onMount(() => {
		// Si no está cargando y no está autenticado, redirigir
		if (!isLoading && !isAuthenticated) {
			const currentPath = $page.url.pathname;
			const redirectTo = encodeURIComponent(currentPath);
			goto(`/?redirect=${redirectTo}`);
		}
	});

	// Si está cargando, mostrar spinner
	{#if isLoading}
		<div class="flex items-center justify-center min-h-screen">
			<div class="flex flex-col items-center gap-4">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
				<p class="text-orange-400 font-display text-lg">Verificando autenticación...</p>
			</div>
		</div>
	{:else if !isAuthenticated}
		<!-- Si no está autenticado, mostrar mensaje mientras redirige -->
		<div class="flex items-center justify-center min-h-screen">
			<div class="text-center">
				<h2 class="text-orange-400 font-display text-xl mb-4">Acceso requerido</h2>
				<p class="text-white/80">Redirigiendo al login...</p>
			</div>
		</div>
	{:else}
		<!-- Si está autenticado, mostrar el contenido -->
		<slot />
	{/if}
</script>
