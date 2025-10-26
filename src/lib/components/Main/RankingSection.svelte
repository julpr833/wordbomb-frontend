<script lang="ts">
	import { onMount } from 'svelte';
	import Ranking from './Ranking/Ranking.svelte';
	import RankingItem from './Ranking/RankingItem.svelte';
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

	let topPlayers: RankingPlayer[] = [];
	let loading = true;

	onMount(async () => {
		try {
			const response = await apiRequest<RankingPlayer[]>('GET', '/api/users/ranking');
			topPlayers = response.slice(0, 7); // Top 7 para la página principal
		} catch (error) {
			console.error('Error cargando ranking:', error);
		} finally {
			loading = false;
		}
	});
</script>

<section id="ranking" class="relative box-content flex flex-col items-center">
	<h2 class="lg:text-5xl tracking-wide font-extrabold font-display text-white text-shadow-sm opacity-80 text-shadow-yellow-800 mb-4 drop-shadow-lg drop-shadow-orange-600">
		RANKING
	</h2>
	<Ranking>
		{#if loading}
			<div class="text-white text-center py-8">Cargando ranking...</div>
		{:else if topPlayers.length === 0}
			<div class="text-white text-center py-8">No hay datos de ranking aún</div>
		{:else}
			{#each topPlayers as player}
				<RankingItem username={player.username} elo={player.wins} />
			{/each}
		{/if}
	</Ranking>
	<a
		href="/ranking"
		class="flex justify-center align-middle items-center self-center mb-8 font-display-header text-black/80 bg-yellow-200 text-lg w-fit px-2 py-0.5 rounded-md outline-black/80 outline-3 before:content-['▼'] before:mr-1 before:text-[#212121]/90 duration-200 hover:scale-105 hover:bg-amber-100"
		>Ver ranking completo</a
	>
</section>
