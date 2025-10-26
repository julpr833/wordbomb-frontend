<script lang="ts">
	interface Props {
		username: string;
		elo: number;
	}

	let { username, elo, ...restProps }: Props = $$props;
</script>

<li class="w-full flex flex-col py-2 px-3 rounded-lg bg-gradient-to-r from-slate-600 via-slate-500 to-slate-700 shadow-lg shadow-black/50 inset-shadow-sm inset-shadow-white/35" {...restProps}>
	<div class="flex justify-between items-center">
		<span id="username" class="text-xl text-shadow-sm text-shadow-orange-900">{username}</span>
		<span id="elo" class="font-sans font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] text-xl"
			>{elo}</span
		>
	</div>
	<div class="text-sm text-white/70 mt-1">
		🏆 {elo} {elo === 1 ? 'victoria' : 'victorias'}
	</div>
</li>
