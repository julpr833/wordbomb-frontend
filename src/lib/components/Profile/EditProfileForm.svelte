<script lang="ts">
	import { authApi, type AuthResponse } from '$lib/api/auth';

	export let dialogRef: HTMLDialogElement | null = null;
	let isLoading = false;
	let errorMessage: object = {};

	async function handleEditProfile(e: Event) {
		if (!(e.target instanceof HTMLFormElement)) return;

		e.preventDefault();
		isLoading = true;

		const formData = new FormData(e.target as HTMLFormElement);
		const newUsername = formData.get('new_username') as string;
		const newPassword = formData.get('new_password') as string;
		const newPasswordConfirm = formData.get('new_pass_confirm') as string;

		if (newPassword !== newPasswordConfirm) {
			errorMessage = { error: 'Las contraseñas no coinciden' };
			isLoading = false;
			return;
		}

		try {
			await authApi.editProfile({
				new_username: newUsername,
				new_password: newPassword,
				new_pass_confirm: newPasswordConfirm
			});

			isLoading = false;
			dialogRef?.close();
		} catch (error) {
			errorMessage = error as object;
			isLoading = false;
		}
	}
</script>

<form on:submit={handleEditProfile}>
	<fieldset class="mx-4 flex flex-col items-center justify-center py-4 text-white">
		<div class="mx-4 flex min-w-full flex-col items-center justify-center">
			<p class="mb-3 max-w-4/3 text-center text-sm text-orange-300">
				Deja en blanco los espacios que no quieras cambiar
			</p>
			<label
				for="new_username"
				class="mx-1 -mb-2 self-start font-display text-orange-400 opacity-80"
				>Editar nombre de usuario</label
			>
			<input
				type="text"
				name="new_username"
				id="new_username"
				placeholder="Nuevo usuario..."
				class="my-2 min-w-full rounded-md px-2 py-1.5 font-mono outline outline-white/70 transition-all duration-250 placeholder:text-sm focus:outline-[#FF6500]"
			/>
		</div>

		<div class="mx-4 flex min-w-full flex-col items-center justify-center">
			<label
				for="new_password"
				class="mx-1 -mb-2 self-start font-display text-orange-400 opacity-80"
				>Editar contraseña</label
			>
			<input
				type="password"
				name="new_password"
				id="new_password"
				placeholder="Nueva contraseña..."
				class="my-2 min-w-full rounded-md px-2 py-1.5 font-mono outline outline-white/70 transition-all duration-250 placeholder:text-sm focus:outline-[#FF6500]"
			/>
		</div>

		<div class="flex min-w-full flex-col items-center justify-center gap-1.5">
			<label
				for="new_pass_confirm"
				class="mx-1 -mb-2 self-start font-display text-orange-400 opacity-80"
				>Confirmar contraseña</label
			>
			<input
				type="password"
				name="new_pass_confirm"
				id="new_pass_confirm"
				placeholder="Confirmar nueva contraseña..."
				class="my-2 min-w-full rounded-md px-2 py-1.5 font-mono outline outline-white/70 transition-all duration-250 placeholder:text-sm focus:outline-[#FF6500]"
			/>
		</div>
		{#if errorMessage}
			<ul class="mx-4 text-sm text-red-400">
				{#each Object.values(errorMessage) as error}
					<li>{error}</li>
				{/each}
			</ul>
		{/if}
		<button
			type="submit"
			class="mt-2 cursor-pointer rounded-sm bg-orange-400 px-3 py-1 font-display text-xl shadow-[2px_2px_10px_rgba(0,0,0,0.35)] inset-shadow-sm inset-shadow-orange-200 transition-colors duration-200 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
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
					Editando perfil...
				</span>
			{:else}
				Editar
			{/if}
		</button>
	</fieldset>
</form>
