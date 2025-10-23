<script lang="ts">
	import { authStore } from '$lib/stores/auth.js';
	import Login from '$lib/components/Header/Login.svelte';
	import PlayButton from '$lib/components/Header/PlayButton.svelte';

	export let showReturn = false;

	$: isAuthenticated = $authStore.isAuthenticated;
</script>

<header
	class="grid min-w-full grid-cols-3 items-center bg-linear-to-r from-[#243c57] to-[#1E3E62] px-10 py-1"
>
	<!-- Navegación dentro de las secciones de la página -->
	<nav class="justify-self-start font-display">
		{#if !showReturn}
			<ul
				class="flex cursor-pointer items-center gap-8 text-center text-lg text-balance text-orange-400"
			>
				<li
					class="transition-[transform, colors] opacity-90 duration-200 hover:rotate-6 hover:text-orange-200"
				>
					<a href="#how-to-play">Reglas</a>
				</li>
				<li
					class="transition-[transform, colors] opacity-90 duration-200 hover:rotate-6 hover:text-orange-200"
				>
					<a href="#gamemodes">Modos de Juego</a>
				</li>
				<li
					class="transition-[transform, colors] opacity-90 duration-100 hover:rotate-6 hover:text-orange-200"
				>
					<a href="#ranking">Ranking</a>
				</li>
				<li
					class="transition-[transform, colors] opacity-90 duration-200 hover:rotate-6 hover:text-orange-200"
				>
					<a href="#footer">Contacto</a>
				</li>
			</ul>
		{:else}
			<a
				class="cursor-pointer justify-self-end rounded-xs bg-cyan-800 px-2 py-2 font-display text-xl text-white shadow-sm inset-shadow-sm shadow-blue-950 inset-shadow-orange-200 transition-colors duration-200 before:mr-2 before:text-2xl before:content-['<'] hover:animate-pulse hover:bg-cyan-700"
				href="/"
			>
				Volver
			</a>
		{/if}
	</nav>

	<PlayButton />

	<!-- Componente Login/Profile con renderizado condicional -->
	<Login />
</header>
