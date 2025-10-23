<script lang="ts">
	interface Props {
		class?: string;
		emoji?: string;
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
	class="box-content flex h-48 w-48 max-w-3xs flex-col items-center justify-around rounded-md border-2 p-4 text-center font-mono text-lg tracking-tight text-pretty text-white shadow-md shadow-[#02001e69] {animate &&
		'scrollanim-float-around'} {className}"
	style="background: linear-gradient(to bottom right, {fromColor}, {toColor}); border-color: {borderColor};"
	{...restProps}
>
	<header class="flex align-middle text-6xl">
		{emoji}
	</header>

	<slot />
</article>
