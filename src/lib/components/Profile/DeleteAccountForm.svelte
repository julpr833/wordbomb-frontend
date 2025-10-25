<script lang="ts">
	import { authApi, type AuthResponse } from '$lib/api/auth';

	export let dialogRef: HTMLDialogElement | null = null;
	let isLoading = false;
	let errorMessage: object = {};

	async function handleDeleteAccount(e: Event) {
		if (!(e.target instanceof HTMLFormElement)) return;

		e.preventDefault();
		isLoading = true;

		const formData = new FormData(e.target as HTMLFormElement);
		const password = formData.get('password') as string;

		try {
			await authApi.deleteAccount({
				password: password
			});

			isLoading = false;
			dialogRef?.close();
		} catch (error) {
			errorMessage = error as object;
			isLoading = false;
		}
	}
</script>

<form on:submit={handleDeleteAccount}>
	<fieldset class="mx-4 flex flex-col items-center justify-center py-4 text-white">
		<div class="mx-4 flex flex-col items-center justify-center">
			<label
				for="password"
				class="mx-1 -mb-2 self-start font-display text-lg text-red-400 opacity-80"
				>Ingresa tu contraseña para confirmar</label
			>
			<input
				type="password"
				name="password"
				id="password"
				required
				placeholder="Contraseña..."
				class="my-2 min-w-full rounded-md px-2 py-1.5 font-mono outline outline-red-500/70 transition-all duration-250 placeholder:text-sm focus:outline-red-500"
			/>
		</div>

		{#if errorMessage && Object.keys(errorMessage).length > 0}
			<ul class="mx-4 text-sm text-red-400">
				{errorMessage}
			</ul>
		{/if}
		<button
			type="submit"
			class="mt-2 cursor-pointer rounded-sm bg-red-500 px-3 py-1 font-display text-xl shadow-[2px_2px_10px_rgba(0,0,0,0.35)] inset-shadow-sm inset-shadow-red-400 transition-colors duration-200 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isLoading}
		>
			{#if isLoading}
				<span class="flex items-center gap-2">
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Eliminando cuenta...
				</span>
			{:else}
				Eliminar mi cuenta
			{/if}
		</button>
	</fieldset>
</form>
