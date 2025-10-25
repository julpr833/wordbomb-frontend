<script lang="ts">
	export let word: { id: number; word: string };
	export let deletingId: number | null;
	export let editingId: number | null;
	export let savingId: number | null;
	export let onEdit: (id: number) => void;
	export let onDelete: (id: number) => void;
	export let onCancelEdit: () => void;
	export let onSaveEdit: (id: number, newWord: string) => void;

	let editValue = word.word;

	$: isDeleting = deletingId === word.id;
	$: isEditing = editingId === word.id;
	$: isSaving = savingId === word.id;
	$: if (isEditing) {
		editValue = word.word;
	}

	function handleSave() {
		if (editValue.trim()) {
			onSaveEdit(word.id, editValue.trim());
		}
	}

	function handleCancel() {
		editValue = word.word;
		onCancelEdit();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSave();
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	}
</script>

<li
	class="flex w-full items-center justify-between gap-4 border-b border-slate-200 px-4 py-2 transition-colors hover:bg-slate-50"
>
	{#if isEditing}
		<input
			type="text"
			bind:value={editValue}
			on:keydown={handleKeydown}
			class="flex-1 rounded-md border-2 border-blue-400 px-3 py-1 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			autofocus
		/>
	{:else}
		<span class="font-semibold text-slate-800">{word.word}</span>
	{/if}

	<div class="flex gap-2">
		{#if isEditing}
			<button
				class="flex items-center gap-1 rounded-md bg-green-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isEditing && !editValue.trim()}
				on:click={handleSave}
			>
				{#if savingId === word.id}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					Guardar
				{/if}
			</button>
			<button
				class="rounded-md bg-gray-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-gray-600"
				on:click={handleCancel}
				disabled={isEditing}
			>
				Cancelar
			</button>
		{:else}
			<button
				class="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
				on:click={() => onEdit(word.id)}
				disabled={deletingId !== null || editingId !== null}
			>
				Editar
			</button>

			<button
				class="flex items-center gap-1 rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isDeleting || editingId !== null}
				on:click={() => onDelete(word.id)}
			>
				{#if isDeleting}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					Eliminar
				{/if}
			</button>
		{/if}
	</div>
</li>
