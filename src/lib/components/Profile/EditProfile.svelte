<script lang="ts">
	import EditProfileForm from './EditProfileForm.svelte';

	let dialog: HTMLDialogElement;

	function handleModalOpen() {
		dialog.showModal();
		dialog.classList.remove('opacity-0');
	}

	function handleModalClose() {
		dialog.classList.add('opacity-0');
	}
</script>

<button
	aria-label="edit-profile"
	on:click={handleModalOpen}
	class="scale-150 cursor-pointer transition-transform duration-200 hover:scale-200"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="orange"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
			d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
		/><path d="M13.5 6.5l4 4" /></svg
	>
</button>

<dialog
	bind:this={dialog}
	on:close={handleModalClose}
	closedby="any"
	class="fixed m-auto min-w-1/4 rounded-md bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] opacity-0 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] transition-opacity duration-300 ease-in-out backdrop:bg-blue-950/50 backdrop:backdrop-blur-xs focus:outline-none [&_input]:text-slate-800"
>
	<h3
		class="border-b-2 border-white/60 bg-slate-600/60 py-2 text-center font-display-header text-2xl text-orange-300"
	>
		Editar Perfil
	</h3>

	<EditProfileForm dialogRef={dialog} />
</dialog>
