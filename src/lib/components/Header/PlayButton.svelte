<script lang="ts">
	import { page } from '$app/state';
	import { authStore } from '$lib/stores/auth';

	$: isAuthenticated = $authStore.isAuthenticated;
</script>

{#if (page.url.pathname as string) !== '/room' && (page.url.pathname as string) !== '/room-manager' && isAuthenticated}
	<a
		href="/room-manager"
		class="relative flex w-fit justify-self-center drop-shadow-sm drop-shadow-transparent transition-all duration-200 hover:scale-110 hover:animate-pulse hover:drop-shadow-orange-400/70"
	>
		<img
			src="/logo-notitle.svg"
			alt="Logo"
			class="aspect-square h-[70px] w-[100px] -translate-y-1 justify-self-center drop-shadow-lg drop-shadow-[#1f1f1f]"
		/>
		<span
			class="absolute translate-x-1/3 translate-y-full rounded-md bg-orange-950 px-1 font-display-header text-xl text-orange-300 drop-shadow-sm drop-shadow-orange-800"
			>Jugar</span
		>
	</a>
{:else}
	<img
		src="/logo-notitle.svg"
		alt="Logo"
		class="aspect-square h-[70px] w-[100px] -translate-y-1 justify-self-center drop-shadow-lg drop-shadow-[#1f1f1f]"
	/>
{/if}
