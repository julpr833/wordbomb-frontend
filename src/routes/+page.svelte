<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.js';
	import Header from '$lib/components/Header.svelte';
	import HeroSection from '$lib/components/Main/HeroSection.svelte';
	import HowToPlaySection from '$lib/components/Main/HowToPlaySection.svelte';
	import GameModesSection from '$lib/components/Main/GameModesSection.svelte';
	import RankingSection from '$lib/components/Main/RankingSection.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Manejar redirección después del login
	onMount(() => {
		const urlParams = new URLSearchParams(page.url.search);
		const redirectTo = urlParams.get('redirect');

		// Si hay un parámetro de redirección y el usuario está autenticado
		if (redirectTo && $authStore.isAuthenticated) {
			// Decodificar la URL de destino y redirigir
			const decodedUrl = decodeURIComponent(redirectTo);
			goto(decodedUrl);
		}
	});
</script>

<svelte:head>
	<title>Wordbomb</title>
	<meta name="description" content="Piensa rápido, escribe aún más rápido... o explota!" />
</svelte:head>

<Header />
<main>
	<HeroSection />
	<HowToPlaySection />
	<GameModesSection />
	<RankingSection />
</main>
<Footer />