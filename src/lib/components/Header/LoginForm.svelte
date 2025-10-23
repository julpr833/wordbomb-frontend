<script lang="ts">
	import { blur, fade } from 'svelte/transition';
	import { authActions } from '$lib/stores/auth.js';
	import { authApi } from '$lib/api/auth.js';

	// Props
	export let authDialog: HTMLDialogElement;

	// Bindings
	let form: HTMLFormElement;
	let isLoading = false;
	let errorMessage = '';

	// Funciones
	async function handleFormSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';

		const formData = new FormData(form);
		const credentials = {
			username: formData.get('username') as string,
			password: formData.get('password') as string
		};

		try {
			const result = await authApi.login(credentials);
			if (result.user && result.token) {
				// Actualizar store de auth
				authActions.login(result.user, result.token);

				// Cerrar modal
				authDialog.close();

				// Resetear formulario
				form.reset();
			}
		} catch (error) {
			errorMessage = (error as string) || 'Error al iniciar sesión';
		} finally {
			isLoading = false;
		}
	}
</script>

<form
	class="content-box flex min-w-full justify-center rounded-b-md p-4"
	in:blur
	out:fade={{ duration: 0 }}
	bind:this={form}
	on:submit={handleFormSubmit}
>
	<fieldset
		class="flex min-w-10/12 flex-col items-center gap-2 text-center text-white"
		disabled={isLoading}
	>
		<legend class="font mb-2 font-display-header text-2xl text-orange-100 opacity-90"
			>Ingresa a tu cuenta</legend
		>

		<div class="flex min-w-full flex-col">
			<label for="username" class="mx-1 -mb-2 self-start font-display text-orange-400 opacity-80"
				>Usuario</label
			>
			<input
				type="text"
				name="username"
				id="username"
				placeholder="Usuario"
				class="my-2 min-w-full rounded-md px-2 py-1.5 font-mono outline outline-white/70 transition-all duration-250 placeholder:text-sm focus:outline-[#FF6500]"
				required
				disabled={isLoading}
			/>
		</div>
		<div class="flex min-w-full flex-col">
			<label for="password" class="mx-1 -mb-2 self-start font-display text-orange-400 opacity-80"
				>Contraseña</label
			>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Contraseña"
				class="my-2 min-w-full rounded-md px-2 py-1.5 font-mono outline outline-white/70 transition-all duration-250 placeholder:text-sm focus:outline-[#FF6500]"
				required
				disabled={isLoading}
			/>
		</div>
		{#if errorMessage}
			<span class="text-sm text-red-400">{errorMessage}</span>
		{/if}
		<button
			type="submit"
			class="mt-2 min-w-2/3 cursor-pointer rounded-sm bg-orange-400 px-3 py-1 font-display text-xl shadow-[2px_2px_10px_rgba(0,0,0,0.35)] inset-shadow-sm inset-shadow-orange-200 transition-colors duration-200 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
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
					Iniciando sesión...
				</span>
			{:else}
				Ingresar
			{/if}
		</button>
	</fieldset>
</form>
