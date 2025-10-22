<script lang="ts">
	import { blur, fade } from 'svelte/transition';
	import { authApi } from '$lib/api/auth.js';

	// Props
	export let authDialog: HTMLDialogElement;

	// Bindings
	let form: HTMLFormElement;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	// Funciones
	function handleModalClose() {
		authDialog.classList.add('opacity-0');
		errorMessage = '';
		successMessage = '';
	}

	async function handleFormSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';
		successMessage = '';

		const formData = new FormData(form);
		const userData = {
			username: formData.get('username') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string
		};

		// Validar confirmación de contraseña
		const password = formData.get('password') as string;
		const passwordConfirmation = formData.get('password_confirmation') as string;

		if (password !== passwordConfirmation) {
			errorMessage = 'Las contraseñas no coinciden';
			isLoading = false;
			return;
		}

		try {
			const result = await authApi.register(userData);

			if (result.success) {
				successMessage = '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.';
				form.reset();

				// Cerrar modal automáticamente después de 2 segundos
				setTimeout(() => {
					handleModalClose();
				}, 2000);
			} else {
				errorMessage = result.message || 'Error al crear la cuenta';
			}
		} catch (error) {
			console.error('Error de registro:', error);
			errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta';
		} finally {
			isLoading = false;
		}
	}
</script>

<form
	class="p-4 flex justify-center min-w-full content-box rounded-b-md"
	in:blur
	out:fade={{ duration: 0 }}
	bind:this={form}
	on:submit={handleFormSubmit}
>
	<fieldset
		class="min-w-10/12 flex flex-col gap-2 items-center text-center text-white"
		disabled={isLoading}
	>
		<legend class="font text-orange-100 opacity-90 text-2xl mb-2 font-display-header"
			>Crea una cuenta</legend
		>

		<!-- Mensaje de éxito -->
		{#if successMessage}
			<div class="mb-4 p-2 bg-green-500/20 border border-green-500/50 rounded-md">
				<p class="text-green-300 text-sm">{successMessage}</p>
			</div>
		{/if}

		<!-- Mensaje de error -->
		{#if errorMessage}
			<div class="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-md">
				<p class="text-red-300 text-sm">{errorMessage}</p>
			</div>
		{/if}

		<div class="flex flex-col min-w-full">
			<label for="username" class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
				>Usuario</label
			>
			<input
				type="text"
				name="username"
				id="username"
				placeholder="Ingresa tu usuario..."
				class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
				required
				disabled={isLoading}
			/>
		</div>
		<div class="flex flex-col min-w-full">
			<label for="email" class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
				>Correo electrónico</label
			>
			<input
				type="email"
				name="email"
				id="email"
				placeholder="Ingresa tu correo electrónico"
				class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
				required
				disabled={isLoading}
			/>
		</div>
		<div class="flex flex-col min-w-full">
			<label for="password" class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
				>Contraseña</label
			>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Contraseña"
				class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
				required
				disabled={isLoading}
			/>
		</div>
		<div class="flex flex-col min-w-full">
			<label
				for="password_confirmation"
				class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
				>Confirmar contraseña</label
			>
			<input
				type="password"
				name="password_confirmation"
				id="password_confirmation"
				placeholder="Confirma tu contraseña..."
				class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
				required
				disabled={isLoading}
			/>
		</div>
		<button
			type="submit"
			class="min-w-2/3 mt-2 bg-orange-400 py-1 px-3 rounded-sm font-display text-xl hover:bg-orange-300 transition-colors duration-200 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] cursor-pointer inset-shadow-sm inset-shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={isLoading}
		>
			{#if isLoading}
				<span class="flex items-center gap-2">
					<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Creando cuenta...
				</span>
			{:else}
				Registrar
			{/if}
		</button>
	</fieldset>
</form>
