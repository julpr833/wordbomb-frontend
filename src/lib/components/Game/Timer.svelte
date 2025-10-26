<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gameStore, gameActions } from '$lib/stores/game.js';

	let interval: number | null = null;

	$: timeRemaining = $gameStore.timeRemaining;
	$: timeLimit = $gameStore.timeLimit;
	$: turnStartTime = $gameStore.turnStartTime;

	// Calcular porcentaje para la barra de progreso
	$: percentage = timeLimit > 0 ? (timeRemaining / timeLimit) * 100 : 0;

	// Color basado en el tiempo restante
	$: color =
		percentage > 60 ? 'bg-green-500' : percentage > 30 ? 'bg-yellow-500' : 'bg-red-500';

	onMount(() => {
		// Actualizar el timer cada 100ms
		interval = window.setInterval(() => {
			if (turnStartTime && $gameStore.gameStatus === 'playing') {
				const elapsed = (Date.now() - turnStartTime) / 1000;
				const remaining = Math.max(0, timeLimit - elapsed);
				gameActions.updateTimeRemaining(remaining);
			}
		}, 100);
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div class="w-full">
	<div class="mb-2 flex items-center justify-between">
		<span class="font-display text-lg text-white/90">Tiempo</span>
		<span class="font-display-header text-2xl font-bold text-orange-400">
			{Math.ceil(timeRemaining)}s
		</span>
	</div>

	<!-- Barra de progreso -->
	<div class="h-4 w-full overflow-hidden rounded-full bg-[#0B192C]">
		<div
			class="h-full transition-all duration-100 {color}"
			style="width: {percentage}%"
		></div>
	</div>
</div>
