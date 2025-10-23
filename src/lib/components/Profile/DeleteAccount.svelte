<script lang="ts">
	import DeleteAccountForm from './DeleteAccountForm.svelte';

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
	aria-label="delete-account"
	on:click={handleModalOpen}
	class="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-red-800 hover:outline-2 hover:outline-red-500"
>
	Eliminar mi cuenta
</button>

<dialog
	bind:this={dialog}
	on:close={handleModalClose}
	closedby="any"
	class="fixed m-auto min-w-1/4 rounded-md bg-linear-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] opacity-0 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] transition-opacity duration-300 ease-in-out backdrop:bg-blue-950/50 backdrop:backdrop-blur-xs focus:outline-none [&_input]:text-slate-800"
>
	<h3
		class="border-b-2 border-white/60 bg-slate-600/60 py-2 text-center font-display-header text-2xl text-red-500"
	>
		Eliminar mi cuenta
	</h3>

	<DeleteAccountForm dialogRef={dialog} />
</dialog>
