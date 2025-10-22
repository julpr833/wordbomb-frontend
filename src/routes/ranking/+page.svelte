<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Ranking from '$lib/components/Main/Ranking/Ranking.svelte';
	import RankingItem from '$lib/components/Main/Ranking/RankingItem.svelte';
</script>

<svelte:head>
	<title>Ranking - Wordbomb</title>
	<meta name="description" content="Ranking de jugadores" />
</svelte:head>

<Header showReturn={true} />
<section class="flex w-full items-center justify-center">
	<Ranking>
		<!-- Traer todos los usuarios del ranking -->
		<!-- Hacer un botoncito de ver más... -->
		<RankingItem username="Ejemplo" elo={3000} />
		<RankingItem username="Ejemplo" elo={2000} />
		<RankingItem username="Ejemplo" elo={1000} />
		<RankingItem username="Ejemplo" elo={800} />
		<RankingItem username="Ejemplo" elo={700} />
		<RankingItem username="Ejemplo" elo={600} />
		<RankingItem username="Ejemplo" elo={500} />
		<RankingItem username="Ejemplo" elo={400} />
		<RankingItem username="Ejemplo" elo={300} />
		<RankingItem username="Ejemplo" elo={200} />
	</Ranking>
</section>
<Footer />
