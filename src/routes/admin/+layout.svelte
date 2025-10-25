<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	// Crear un store reactivo para el estado
	const currentTab = writable('game');

	function switchTab(tab: 'game' | 'player') {
		currentTab.set(tab);
	}

	function goToHome() {
		goto('/');
	}

	// Context para compartir el estado entre componentes
	setContext('adminTab', {
		currentTab,
		switchTab
	});
</script>

<div class="admin-layout">
	<div class="sidebar">
		<button class="logo" on:click={goToHome}>
			<h1>WordBomb</h1>
		</button>

		<nav class="nav-menu">
			<button
				class="nav-item"
				class:active={$currentTab === 'game'}
				on:click={() => switchTab('game')}
			>
				Panel de Juego
			</button>
			<button
				class="nav-item"
				class:active={$currentTab === 'player'}
				on:click={() => switchTab('player')}
			>
				Panel de Jugadores
			</button>
		</nav>
	</div>

	<div class="main-content">
		<slot />
	</div>
</div>

<style>
	.admin-layout {
		display: flex;
		height: 100vh;
		background: linear-gradient(
			200deg,
			oklch(31.197% 0.04265 256.477) 0%,
			oklch(20.197% 0.04265 256.477) 50%,
			oklch(25.833% 0.07346 252.938) 100%
		);
		background-attachment: fixed;
	}

	.sidebar {
		width: 250px;
		background: linear-gradient(to bottom, #243c57, #1e3e62);
		color: white;
		padding: 20px;
		display: flex;
		flex-direction: column;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
	}

	.logo {
		cursor: pointer;
		margin-bottom: 30px;
		padding: 15px;
		border-radius: 12px;
		transition: all 0.3s ease;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
	}

	.logo:hover {
		background: rgba(255, 165, 0, 0.8);
		transform: scale(1.05);
	}

	.logo h1 {
		margin: 0;
		font-size: 28px;
		font-weight: bold;
		color: white;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		font-family: 'Jersey 15', system-ui;
	}

	.nav-menu {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.nav-item {
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: #fbbf24;
		padding: 15px 20px;
		text-align: left;
		border-radius: 12px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 600;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.nav-item:hover {
		background: rgba(255, 165, 0, 0.3);
		color: white;
		transform: translateX(5px);
		box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
	}

	.nav-item.active {
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: white;
		font-weight: bold;
		box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
		transform: translateX(5px);
	}

	.main-content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
	}
</style>
