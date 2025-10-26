<script lang="ts">
	import { gameStore } from '$lib/stores/game.js';
	import { authStore } from '$lib/stores/auth.js';
	import { socketService } from '$lib/socket.js';
	import { onMount, afterUpdate } from 'svelte';

	let message = '';
	let chatContainer: HTMLDivElement;

	$: messages = $gameStore.chatMessages;
	$: currentUsername = $authStore.user?.username;

	function sendMessage() {
		if (!message.trim()) return;

		socketService.sendMessage(message);
		message = '';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Auto-scroll al final cuando hay nuevos mensajes
	afterUpdate(() => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	onMount(() => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});
</script>

<div class="flex h-full flex-col rounded-lg bg-[#1E3E62] shadow-lg">
	<div class="border-b border-white/10 p-4">
		<h3 class="font-display-header text-xl text-orange-400">Chat</h3>
	</div>

	<!-- Mensajes -->
	<div bind:this={chatContainer} class="flex-1 space-y-2 overflow-y-auto p-4">
		{#if messages.length === 0}
			<p class="text-center text-sm text-white/50">No hay mensajes aún</p>
		{:else}
			{#each messages as msg}
				{@const isMe = msg.username === currentUsername}
				<div class="flex {isMe ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] rounded-lg p-2 {isMe
							? 'bg-orange-500 text-white'
							: 'bg-[#0B192C] text-white/90'}"
					>
						<div class="mb-1 text-xs font-medium {isMe ? 'text-white/80' : 'text-orange-400'}">
							{msg.username}
						</div>
						<div class="break-words font-display text-sm">
							{msg.message}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Input -->
	<div class="border-t border-white/10 p-4">
		<form on:submit|preventDefault={sendMessage} class="flex gap-2">
			<input
				type="text"
				bind:value={message}
				on:keypress={handleKeyPress}
				placeholder="Escribe un mensaje..."
				class="flex-1 rounded-lg bg-[#0B192C] px-4 py-2 font-display text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-500"
				maxlength="200"
			/>
			<button
				type="submit"
				disabled={!message.trim()}
				class="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Enviar
			</button>
		</form>
	</div>
</div>

<style>
	/* Estilos para el scroll */
	div::-webkit-scrollbar {
		width: 8px;
	}

	div::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 4px;
	}

	div::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}
</style>
