<script lang="ts">
	import Arrow from './Arrow.svelte';
	import Bomb from './Bomb.svelte';
	import Explosion from './Explosion.svelte';
</script>

<section id="hero" class="flex relative flex-col items-center justify-center lg:min-h-[100dvh] mb-4">
	<hgroup class="flex items-center flex-col text-center my-12 text-white font-display text-shadow-sm text-shadow-orange-800">
		<h1 class="lg:text-6xl tracking-wider font-extrabold">Wordbomb</h1>
		<h2 class="lg:text-4xl py-2 opacity-90">
			Piensa rápido, escribe aún más rápido...
			<span class="text-shadow-md text-shadow-yellow-700 text-orange-100">o explota!</span>
		</h2>
	</hgroup>
	<Bomb
		class="absolute -z-10 -translate-y-4 -translate-x-6"
		width={240}
		height={240}
		fill="oklch(62.26% 0.1203 52.1)"
		base="oklch(50.26% 0.1203 52.1)"
		fuse="oklch(30.26% 0.1203 52.1)"
	/>
	<Arrow
		class="absolute -z-20 motion-safe:animate-[spinbounce_6s_cubic-bezier(0.68,-0.55,0.265,1.55)_infinite]"
		fill="oklch(58.91% 0.2300 28.2)"
		width={300}
		height={360}
	/>
	<Explosion class="absolute opacity-20 -z-10 left-10 bottom-20" />
	<Explosion class="absolute opacity-20 -z-10 right-30 top-20" />
	<Explosion class="absolute opacity-20 -z-10 left-80 top-10 -rotate-[20deg]" />
	<Explosion class="absolute opacity-20 -z-10 right-100 bottom-0 rotate-[20deg]" />
	<Explosion class="absolute -z-10 scrollanim-explode motion-reduce:hidden" />
</section>
