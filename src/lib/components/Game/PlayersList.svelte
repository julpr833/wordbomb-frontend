<script lang="ts">
	import { gameStore } from '$lib/stores/game.js';
	import { authStore } from '$lib/stores/auth.js';

	$: players = $gameStore.players;
	$: currentPlayer = $gameStore.currentPlayer;
	$: gameStatus = $gameStore.gameStatus;
	$: currentUsername = $authStore.user?.username;
	
	// Debug: Log players para ver si tienen avatares
	$: {
		console.log('Players data:', players);
		players.forEach(p => {
			console.log(`Player ${p.username} avatar:`, p.avatar);
		});
	}

	// Colores de avatar basados en el username
	function getAvatarColor(username: string): string {
		const colors = [
			'bg-red-500',
			'bg-blue-500',
			'bg-green-500',
			'bg-yellow-500',
			'bg-purple-500',
			'bg-pink-500',
			'bg-indigo-500',
			'bg-teal-500',
			'bg-orange-500',
			'bg-cyan-500'
		];
		
		// Generar un índice basado en el username
		let hash = 0;
		for (let i = 0; i < username.length; i++) {
			hash = username.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	}

	// Obtener iniciales del username
	function getInitials(username: string): string {
		return username.substring(0, 2).toUpperCase();
	}
</script>

<div class="rounded-lg bg-[#1E3E62] p-4 shadow-lg">
	<h3 class="mb-4 font-display-header text-xl text-orange-400">
		Jugadores ({players.length})
	</h3>

	<div class="space-y-3">
		{#each players as player}
			{@const isCurrentTurn = gameStatus === 'playing' && player.username === currentPlayer}
			{@const isMe = player.username === currentUsername}
			{@const isDead = player.isAlive === false}

			<div
				class="rounded-lg p-3 transition-all {isCurrentTurn
					? 'bg-orange-500/20 ring-2 ring-orange-500'
					: 'bg-[#0B192C]/50'} {isDead ? 'opacity-50 grayscale' : ''}"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<!-- Avatar -->
						<div class="relative">
							{#if player.avatar}
								<!-- Avatar de la base de datos -->
								<img
									src={player.avatar}
									alt={player.username}
									class="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-[#1E3E62]"
									on:error={(e) => {
										console.error(`Error cargando avatar de ${player.username}:`, player.avatar);
										const target = e.currentTarget as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
								<!-- Fallback si la imagen falla -->
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full {getAvatarColor(
										player.username
									)} font-display-header text-lg font-bold text-white shadow-lg"
									style="display: none;"
								>
									{getInitials(player.username)}
								</div>
							{:else}
								<!-- Avatar con iniciales (fallback) -->
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full {getAvatarColor(
										player.username
									)} font-display-header text-lg font-bold text-white shadow-lg"
								>
									{getInitials(player.username)}
								</div>
							{/if}
							<!-- Indicador de turno -->
							{#if isCurrentTurn}
								<div
									class="absolute -bottom-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-orange-500 ring-2 ring-[#1E3E62]"
								></div>
							{:else if !isDead}
								<div
									class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-[#1E3E62]"
								></div>
							{:else}
								<div
									class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gray-500 ring-2 ring-[#1E3E62]"
								></div>
							{/if}
						</div>

						<!-- Nombre -->
						<div class="flex flex-col">
							<span class="font-display font-medium text-white">
								{player.username}
								{#if isMe}
									<span class="text-xs text-orange-400">(Tú)</span>
								{/if}
							</span>
							{#if isDead}
								<span class="text-xs text-red-400">Eliminado</span>
							{:else if isCurrentTurn}
								<span class="text-xs text-orange-400">Su turno</span>
							{/if}
						</div>
					</div>

					<!-- Estadísticas -->
					<div class="flex items-center gap-3">
						{#if gameStatus === 'playing' && player.lives !== undefined}
							<div class="flex items-center gap-1">
								<span class="text-sm">❤️</span>
								<span class="font-display-header text-sm font-bold text-red-400">
									{player.lives}
								</span>
							</div>
						{/if}

						<div class="flex items-center gap-1">
							<span class="text-sm">⭐</span>
							<span class="font-display-header text-sm font-bold text-yellow-400">
								{player.points}
							</span>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
