<script lang="ts">
	import { authStore, authActions } from '$lib/stores/auth.js';
	import { authApi } from '$lib/api/auth.js';
	import { onMount } from 'svelte';
	import { blur, fade } from 'svelte/transition';
	import { page } from '$app/state';

	// Estado del componente
	let isDropdownOpen = false;
	let profileMenu: HTMLDivElement;

	// Estado reactivo de auth
	$: isAuthenticated = $authStore.isAuthenticated;
	$: user = $authStore.user;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	async function handleLogout() {
		try {
			await authApi.logout();
			authActions.logout();
			closeDropdown();
		} catch (error) {
			console.error('Error de logout:', error);
			// Aún así hacer logout localmente aunque falle la petición al servidor
			authActions.logout();
			closeDropdown();
		}
	}

	// Cerrar dropdown al hacer click fuera
	function handleClickOutside(event: MouseEvent) {
		if (profileMenu && !profileMenu.contains(event.target as Node)) {
			closeDropdown();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative" bind:this={profileMenu} in:blur>
	<!-- Botón de perfil -->
	<button
		on:click={toggleDropdown}
		class="flex cursor-pointer items-center gap-2 justify-self-end rounded-sm bg-orange-800 px-3 py-1.5 font-display text-xl text-white shadow-sm shadow-blue-950 transition-colors duration-200 hover:bg-orange-600"
	>
		<!-- Foto de perfil o avatar -->
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-sm font-bold text-white"
		>
			{#if user?.avatar}
				<img src={user.avatar} alt={user.username} class="h-8 w-8 rounded-full object-cover" />
			{:else}
				{user?.username?.charAt(0).toUpperCase() || 'U'}
			{/if}
		</div>
		<span class="hidden sm:inline">{user?.username || 'Usuario'}</span>
		<svg
			class="h-4 w-4 transition-transform duration-200 {isDropdownOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
			></path>
		</svg>
	</button>

	<!-- Menú desplegable -->
	{#if isDropdownOpen}
		<div
			class="absolute right-0 z-50 mt-2 w-48 rounded-md border border-orange-400/20 bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] shadow-lg"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 150 }}
		>
			<div class="py-1">
				<!-- Información del usuario -->
				<div class="border-b border-orange-400/20 px-4 py-2">
					<p class="text-sm font-medium text-orange-400">{user?.username}</p>
					{#if user?.email}
						<p class="text-xs text-orange-300/70">{user.email}</p>
					{/if}
				</div>

				<!-- Elementos del menú -->
				{#if page.url.pathname !== '/profile'}
					<a
						href="/profile"
						class="block w-full px-4 py-2 text-left text-sm text-orange-200 transition-colors duration-150 hover:bg-orange-400/20 hover:text-orange-100"
					>
						Perfil
					</a>
				{/if}

				<div class="border-t border-orange-400/20"></div>

				<button
					on:click={handleLogout}
					class="block w-full px-4 py-2 text-left text-sm text-red-400 transition-colors duration-150 hover:bg-red-400/20 hover:text-red-300"
				>
					Cerrar Sesión
				</button>
			</div>
		</div>
	{/if}
</div>
