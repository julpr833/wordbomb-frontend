<script lang="ts">
	import { gameStore } from '$lib/stores/game.js';
	import { authStore } from '$lib/stores/auth.js';
	import { socketService } from '$lib/socket.js';

	let word = '';
	let typingTimeout: number | null = null;

	$: currentPlayer = $gameStore.currentPlayer;
	$: currentUsername = $authStore.user?.username;
	$: isMyTurn = currentPlayer === currentUsername;
	$: lastWordStatus = $gameStore.lastWordStatus;
	$: lastWordSubmitted = $gameStore.lastWordSubmitted;
	$: lastWordReason = $gameStore.lastWordReason;
	$: playerTyping = $gameStore.playerTyping;

	function submitWord() {
		if (!word.trim() || !isMyTurn) return;

		socketService.submitWord(word);
		socketService.sendTyping(''); // Limpiar el indicador de escritura
		word = '';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			submitWord();
		}
	}

	function handleInput() {
		if (!isMyTurn) return;

		// Enviar lo que se está escribiendo con debounce
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		// Enviar inmediatamente
		socketService.sendTyping(word);

		// Limpiar después de 1 segundo de inactividad
		typingTimeout = window.setTimeout(() => {
			socketService.sendTyping('');
		}, 1000);
	}
</script>

<div class="space-y-4">
	<!-- Feedback de última palabra -->
	{#if lastWordStatus && lastWordSubmitted}
		<div
			class="rounded-lg p-4 {lastWordStatus === 'accepted'
				? 'bg-green-500/20 text-green-400'
				: 'bg-red-500/20 text-red-400'}"
		>
			<div class="flex items-center gap-2">
				<span class="text-2xl">{lastWordStatus === 'accepted' ? '✅' : '❌'}</span>
				<div>
					<div class="font-display-header text-lg font-bold">
						{lastWordSubmitted}
					</div>
					{#if lastWordReason}
						<div class="font-display text-sm">
							{lastWordReason}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Input de palabra -->
	<div class="rounded-lg bg-[#1E3E62] p-6 shadow-lg">
		{#if isMyTurn}
			<form on:submit|preventDefault={submitWord} class="space-y-4">
				<div>
					<label for="word-input" class="mb-2 block font-display text-sm text-white/70">
						Escribe tu palabra
					</label>
					<input
						id="word-input"
						type="text"
						bind:value={word}
						on:input={handleInput}
						on:keypress={handleKeyPress}
						placeholder="PALABRA"
						class="w-full rounded-lg bg-[#0B192C] px-6 py-4 text-center font-display-header text-3xl uppercase text-white placeholder-white/30 outline-none focus:ring-4 focus:ring-orange-500"
						maxlength="30"
						autocomplete="off"
					/>
				</div>

				<button
					type="submit"
					disabled={!word.trim()}
					class="w-full rounded-lg bg-orange-500 px-6 py-4 font-display-header text-xl font-bold text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Enviar Palabra
				</button>
			</form>
		{:else}
			<div class="text-center">
				<p class="font-display text-lg text-white/70">
					{#if currentPlayer}
						Turno de <span class="font-bold text-orange-400">{currentPlayer}</span>
					{:else}
						Esperando...
					{/if}
				</p>
				
				<!-- Mostrar lo que está escribiendo el jugador actual -->
				{#if playerTyping && playerTyping.word}
					<div class="mt-4 animate-pulse rounded-lg bg-orange-500/20 p-4">
						<p class="font-display text-sm text-orange-400">
							{playerTyping.username} está escribiendo...
						</p>
						<p class="font-display-header text-2xl font-bold text-white">
							{playerTyping.word}
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
