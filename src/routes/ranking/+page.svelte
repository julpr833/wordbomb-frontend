<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Ranking from '$lib/components/Main/Ranking/Ranking.svelte';
	import RankingItem from '$lib/components/Main/Ranking/RankingItem.svelte';
	import { apiRequest } from '$lib/api';

	interface RankingPlayer {
		rank: number;
		username: string;
		avatar: string | null;
		wins: number;
		total_games: number;
		winrate: number;
		total_points: number;
	}

	let allPlayers: RankingPlayer[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await apiRequest<RankingPlayer[]>('GET', '/api/users/ranking');
			allPlayers = response;
		} catch (err) {
			console.error('Error cargando ranking:', err);
			error = 'Error al cargar el ranking. Intenta de nuevo más tarde.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Ranking - Wordbomb</title>
	<meta name="description" content="Ranking de jugadores" />
</svelte:head>

<Header showReturn={true} />
<section class="flex w-full flex-col items-center justify-center py-8">
	<h1 class="text-4xl font-display-header text-white text-center mb-4">
		🏆 Ranking Global
	</h1>
	
	<Ranking>
		{#if loading}
			<div class="text-white text-center py-8 w-full">
				<div class="animate-pulse">Cargando ranking...</div>
			</div>
		{:else if error}
			<div class="text-red-400 text-center py-8 w-full">{error}</div>
		{:else if allPlayers.length === 0}
			<div class="text-white text-center py-8 w-full">
				No hay jugadores en el ranking aún. ¡Sé el primero en jugar!
			</div>
		{:else}
			{#each allPlayers as player}
				<RankingItem username={player.username} elo={player.wins} />
			{/each}
		{/if}
	</Ranking>
</section>
<Footer />
