<script lang="ts">
	interface Props {
		class?: string;
		emoji: string;
		animate?: boolean;
		fromColor?: string;
		toColor?: string;
		borderColor?: string;
	}

	let {
		class: className,
		emoji,
		animate = true,
		fromColor = '#5A3425',
		toColor = '#512413',
		borderColor = '#F56D3C',
		...restProps
	}: Props = $$props;
</script>

<article
	class="flex flex-col items-center text-white max-w-3xs text-center h-48 text-lg w-48 p-4 box-content tracking-tight font-mono text-pretty shadow-md shadow-[#02001e69] border-2 rounded-md justify-around {animate && 'scrollanim-float-around'} {className}"
	style="background: linear-gradient(to bottom right, {fromColor}, {toColor}); border-color: {borderColor};"
	{...restProps}
>
	<header class="flex align-middle text-6xl">
		{emoji}
	</header>

	<slot />
</article>
