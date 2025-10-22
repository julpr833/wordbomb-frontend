<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { authActions } from '$lib/stores/auth.js';

	export const title = 'Wordbomb';
	export const description = '';

	onMount(() => {
		// Inicializar store de auth
		authActions.initialize();
	});
</script>

<slot />