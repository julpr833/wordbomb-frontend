import '../app.css';
import { onMount } from 'svelte';
import { authActions } from '$lib/stores/auth.js';

export let title = 'Wordbomb';
export let description = '';

onMount(() => {
	// Inicializar store de auth
	authActions.initialize();
});