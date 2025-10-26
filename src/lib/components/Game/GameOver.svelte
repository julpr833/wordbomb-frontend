<script lang="ts">
	import { gameStore } from '$lib/stores/game.js';
	import { goto } from '$app/navigation';
	import { socketService } from '$lib/socket.js';
	import { gameActions } from '$lib/stores/game.js';

	$: gameEndData = $gameStore.gameEndData;

	function returnToLobby() {
		socketService.leaveRoom();
		socketService.disconnect();
		gameActions.leaveRoom();
		goto('/');
	}
</script>

{#if gameEndData}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
		<div class="w-full max-w-2xl rounded-lg bg-[#1E3E62] p-8 shadow-2xl">
			<!-- Título -->
			<div class="mb-8 text-center">
				<h2 class="mb-2 font-display-header text-4xl text-orange-400">¡Juego Terminado!</h2>
				<div class="text-2xl text-white">
					🏆 Ganador: <span class="font-bold text-yellow-400">{gameEndData.winner}</span>
				</div>
			</div>

			<!-- Estadísticas -->
			<div class="mb-6 grid grid-cols-2 gap-4">
				<div class="rounded-lg bg-[#0B192C] p-4 text-center">
					<div class="font-display text-sm text-white/70">Rondas Totales</div>
					<div class="font-display-header text-3xl font-bold text-orange-400">
						{gameEndData.total_rounds}
					</div>
				</div>
				<div class="rounded-lg bg-[#0B192C] p-4 text-center">
					<div class="font-display text-sm text-white/70">Palabras Usadas</div>
					<div class="font-display-header text-3xl font-bold text-orange-400">
						{gameEndData.total_words}
					</div>
				</div>
			</div>

			<!-- Tabla de puntuaciones -->
			<div class="mb-6 rounded-lg bg-[#0B192C] p-4">
				<h3 class="mb-4 font-display-header text-xl text-orange-400">Puntuaciones Finales</h3>
				<div class="space-y-2">
					{#each gameEndData.final_scores.sort((a, b) => b.points - a.points) as score, index}
						<div
							class="flex items-center justify-between rounded-lg p-3 {index === 0
								? 'bg-yellow-500/20'
								: 'bg-white/5'}"
						>
							<div class="flex items-center gap-3">
								<span class="font-display-header text-2xl">
									{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
								</span>
								<span class="font-display text-lg text-white">{score.username}</span>
							</div>

							<div class="flex items-center gap-4">
								<div class="flex items-center gap-1">
									<span class="text-sm">❤️</span>
									<span class="font-display-header font-bold text-red-400">{score.lives}</span>
								</div>
								<div class="flex items-center gap-1">
									<span class="text-sm">⭐</span>
									<span class="font-display-header font-bold text-yellow-400">{score.points}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Botón -->
			<button
				on:click={returnToLobby}
				class="w-full rounded-lg bg-orange-500 px-6 py-4 font-display-header text-xl font-bold text-white transition-colors hover:bg-orange-600"
			>
				Volver al Lobby
			</button>
		</div>
	</div>
{/if}
