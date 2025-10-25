<script lang="ts">
	import { wordApi, type GetWordsResponse } from '$lib/api/words';
	import { getContext, onMount } from 'svelte';
	import Word from './Word.svelte';

	const adminTab = getContext('adminTab');

	// Datos de ejemplo para el panel de juego
	let gameStats = {
		activeRooms: 5,
		totalPlayers: 23,
		gamesPlayed: 156,
		averageGameTime: '3:45'
	};

	// Gestión de palabras
	let words: Array<{ id: number; word: string }> = [];

	let loaders = {
		words: true,
		adding: false
	};

	let deletingWordId: number | null = null;
	let editingWordId: number | null = null;
	let savingWordId: number | null = null;

	let errorMsg: { error?: string } = {};

	let searchQuery = '';
	let filteredWords = words;
	let showAddForm = false;
	let newWord: string = '';

	$: {
		if (searchQuery) {
			filteredWords = words.filter((word) =>
				word.word.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			filteredWords = words;
		}
	}

	async function addWord(e: SubmitEvent) {
		e.preventDefault();
		if (newWord) {
			loaders.adding = true;
			try {
				const response = await wordApi.addWord(newWord);
				words = response.words?.map((w) => {
					return { id: w.id, word: w.word };
				});
				newWord = '';
				showAddForm = false;
				errorMsg = {};
			} catch (error) {
				errorMsg = error as { error?: string };
			}
		} else {
			console.error('La palabra no puede estar vacía');
			errorMsg = { error: 'La palabra no puede estar vacía' };
		}
		loaders.adding = false;
	}

	async function deleteWord(id: number) {
		deletingWordId = id;
		try {
			await wordApi.deleteWord(id);
			words = words.filter((word) => word.id !== id);
		} catch (error) {
			console.error('Error al eliminar la palabra:', error);
		}
		deletingWordId = null;
	}

	function editWord(id: number) {
		editingWordId = id;
	}

	function cancelEdit() {
		editingWordId = null;
	}

	async function saveEdit(id: number, newWord: string) {
		savingWordId = id;
		try {
			const response = await wordApi.editWord(id, newWord);

			// Actualizar la palabra en el array local
			words = words.map((word) => {
				if (word.id === id) {
					return { ...word, word: newWord };
				}
				return word;
			});

			editingWordId = null;
			errorMsg = {};
		} catch (error) {
			console.error('Error al editar la palabra:', error);
			errorMsg = error as { error?: string };
		}
		savingWordId = null;
	}

	onMount(async () => {
		const response: GetWordsResponse = await wordApi.getWords();
		if (Object.keys(response).length) {
			words = response.words?.map((w) => {
				return { id: w.id, word: w.word };
			});
			loaders.words = false;
		} else {
			console.error('Error al cargar las palabras: respuesta inesperada', response);
		}
	});
</script>

<div class="game-panel">
	<div class="panel-header">
		<h2>Panel de Juego</h2>
		<p>Gestiona las palabras del juego y configuración</p>
	</div>

	<div class="content-card">
		<!-- Barra de búsqueda -->
		<div class="search-section">
			<div class="search-box">
				<div class="search-icon">🔍</div>
				<input
					type="text"
					placeholder="Buscar Palabra"
					bind:value={searchQuery}
					class="search-input"
				/>
			</div>
		</div>

		<!-- Sección de palabras -->
		<div class="words-section flex w-full flex-col">
			<h3>Palabras</h3>

			<div class="words-table">
				<ul class="flex w-full flex-col items-center justify-between">
					{#each filteredWords as word}
						<Word
							{word}
							deletingId={deletingWordId}
							editingId={editingWordId}
							savingId={savingWordId}
							onEdit={editWord}
							onDelete={deleteWord}
							onCancelEdit={cancelEdit}
							onSaveEdit={saveEdit}
						/>
					{/each}
				</ul>

				{#if loaders.words}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else if filteredWords.length === 0}
					<div>No se encontraron palabras.</div>
				{/if}
			</div>

			<!-- Formulario para agregar palabra -->
			{#if showAddForm}
				<div class="add-word-form">
					<h4>Agregar Nueva Palabra</h4>
					{#if errorMsg}
						{#each Object.values(errorMsg) as msg}
							<span class="text-sm text-red-400">{msg}</span>
						{/each}
					{/if}
					<form class="form-row" on:submit={addWord}>
						<input type="text" placeholder="Palabra" bind:value={newWord} class="form-input" />
						<button
							class="btn btn-primary flex items-center gap-2 disabled:opacity-50"
							type="submit"
							disabled={loaders.adding}
						>
							{#if loaders.adding}
								<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
							{/if}
							Agregar
						</button>
						<button class="btn btn-secondary" on:click={() => (showAddForm = false)}>
							Cancelar
						</button>
					</form>
				</div>
			{/if}

			<!-- Botón para agregar palabra -->
			<div class="add-button-section">
				<button class="btn btn-primary add-word-btn" on:click={() => (showAddForm = true)}>
					<span class="plus-icon">+</span>
					Agregar Palabra
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.game-panel {
		padding: 20px;
		max-width: 1200px;
	}

	.panel-header {
		margin-bottom: 30px;
	}

	.panel-header h2 {
		margin: 0 0 10px 0;
		color: white;
		font-size: 28px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		font-family: 'Jersey 15', system-ui;
	}

	.panel-header p {
		margin: 0;
		color: #fbbf24;
		font-size: 16px;
		opacity: 0.9;
	}

	.content-card {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 16px;
		padding: 30px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.search-section {
		margin-bottom: 30px;
	}

	.search-box {
		position: relative;
		max-width: 400px;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #7f8c8d;
		font-size: 16px;
	}

	.search-input {
		width: 100%;
		padding: 12px 12px 12px 40px;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.3s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: #3498db;
	}

	.words-section h3 {
		margin: 0 0 20px 0;
		color: #2c3e50;
		font-size: 20px;
	}

	.words-table {
		display: grid;
		width: 100%;
		grid-template-columns: 2fr 1fr;
		gap: 15px;
		margin-bottom: 30px;
	}

	.table-header {
		display: contents;
		font-weight: 600;
		color: #7f8c8d;
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.table-header > div {
		padding: 15px 0;
		border-bottom: 2px solid #ecf0f1;
	}

	.add-word-form {
		background-color: hsl(from #f8f9fa h s calc(l - 10));
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.add-word-form h4 {
		margin: 0 0 15px 0;
		color: #2c3e50;
		font-size: 16px;
	}

	.form-row {
		display: flex;
		gap: 10px;
		align-items: center;
		flex-wrap: wrap;
	}

	.form-input {
		padding: 8px 12px;
		border: 2px solid #ecf0f1;
		border-radius: 6px;
		font-size: 14px;
		flex: 1;
		min-width: 150px;
	}

	.form-input:focus {
		outline: none;
		border-color: #3498db;
	}

	.add-button-section {
		text-align: center;
	}

	.add-word-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.add-word-btn:hover {
		background-color: #2980b9;
	}

	.plus-icon {
		font-size: 18px;
		font-weight: bold;
	}

	.btn {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-primary {
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: #1f2937;
		font-weight: 600;
		box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #f59e0b, #d97706);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
	}

	.btn-secondary {
		background: linear-gradient(135deg, #6b7280, #4b5563);
		color: white;
		font-weight: 600;
	}

	.btn-secondary:hover {
		background: linear-gradient(135deg, #4b5563, #374151);
		transform: translateY(-2px);
	}
</style>
