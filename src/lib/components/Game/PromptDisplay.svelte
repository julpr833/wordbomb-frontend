<script lang="ts">
	import { gameStore } from '$lib/stores/game.js';
	import type { Prompt } from '$lib/stores/game.js';

	$: prompt = $gameStore.currentPrompt as Prompt | null;
	$: gamemode = $gameStore.roomInfo?.gamemode;

	// Mapeo de modos de juego
	const gamemodeNames: Record<number, string> = {
		1: 'CLÁSICO',
		2: 'INVERSO',
		3: 'HARDCORE'
	};

	// Mapeo de dificultades
	const difficultyNames: Record<number, string> = {
		1: 'FÁCIL',
		2: 'NORMAL',
		3: 'DIFÍCIL'
	};

	$: gamemodeName = gamemode ? gamemodeNames[gamemode] || 'CLÁSICO' : 'CLÁSICO';
	$: difficultyName = $gameStore.roomInfo?.difficulty
		? difficultyNames[$gameStore.roomInfo.difficulty] || 'NORMAL'
		: 'NORMAL';
</script>

<div class="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-2xl">
	<div class="mb-2 flex items-center justify-between">
		<span class="text-sm font-medium text-white/80">{gamemodeName}</span>
		<span class="text-sm font-medium text-white/80">{difficultyName}</span>
	</div>

	{#if prompt}
		<div class="mb-3 text-center">
			<div class="font-display-header text-6xl font-bold text-white">
				{prompt.value}
			</div>
		</div>

		<div class="text-center">
			<p class="font-display text-sm text-white/90">
				{prompt.description}
			</p>
		</div>
	{:else}
		<div class="text-center">
			<p class="font-display text-white/70">Esperando turno...</p>
		</div>
	{/if}
</div>
