<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { authActions } from '$lib/stores/auth.js';
	import { onNavigate } from '$app/navigation';

	export const title = 'Wordbomb';
	export const description = '';

	onMount(() => {
		// Inicializar store de auth
		authActions.initialize();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<slot />
