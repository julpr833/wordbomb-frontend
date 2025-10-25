<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { adminApi, type Player, type GetAllPlayersResponse } from '$lib/api/admin'; // Asume que el archivo admin.ts está en '../api/admin.ts'

	const adminTab = getContext('adminTab');

	// Estado para los datos de los jugadores
	let players: Player[] = []; // Inicializar como array de Player
	let loading = true;
	let error: string | null = null;

	let processingId: number | null = null;

	// Variables para la interfaz de usuario
	let searchQuery = '';
	let statusFilter = 'TODOS'; // Cambiado a 'TODOS' para ver todos por defecto
	let filteredPlayers: Player[] = [];

	async function loadPlayers() {
		loading = true;
		error = null;
		try {
			const response = await adminApi.getAllPlayers();
			if (response.error) {
				error = response.error;
				players = [];
			} else {
				// El backend get_all_players.py no devuelve email, por lo que usaremos una versión simplificada de Player
				// y nos aseguraremos de que los datos de la tabla usen 'status' y no 'banned' como se usó en el mock.
				// El backend devuelve: ID_Usuario, Username, Vetado -> lo convierte a "status": "BANEADO" | "ACTIVO"
				players = response.players.map((p) => ({
					...p,
					banned: p.status // Usamos 'status' del backend, que es "ACTIVO" | "BANEADO"
				}));
			}
		} catch (e) {
			error = 'Error al cargar los jugadores.';
			players = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadPlayers();
	});

	// --- Lógica de Filtros ---
	$: {
		let filtered = players;
		if (searchQuery) {
			filtered = filtered.filter((player) =>
				player.username.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (statusFilter !== 'TODOS') {
			// El backend devuelve 'ACTIVO' o 'BANEADO' en el campo 'status'
			filtered = filtered.filter((player) => player.status === statusFilter);
		}

		filteredPlayers = filtered;
	}
	async function toggleBan(id: number, ban: boolean) {
		processingId = id;
		const action = ban ? 'banear' : 'desbanear';
		try {
			// 'banUser' espera la ID como string y el estado como 1 o 0
			const response = await adminApi.banUser(String(id), ban);

			if (response.error) {
				alert(`Error al ${action}: ${response.error}`);
			} else {
				// Recargar la lista para reflejar el cambio
				loadPlayers();
			}
		} catch (e) {
			alert(`Error de conexión al intentar ${action} al jugador.`);
		}
		processingId = null;
	}
</script>

<div class="player-panel">
	<div class="panel-header">
		<h2>Panel de Jugadores</h2>
		<p>Gestiona y monitorea la actividad de los jugadores</p>
	</div>

	<div class="content-card">
		<div class="search-filter-section">
			<div class="search-box">
				<div class="search-icon">🔍</div>
				<input
					type="text"
					placeholder="Buscar Jugador"
					bind:value={searchQuery}
					class="search-input"
				/>
			</div>

			<div class="filter-box">
				<select bind:value={statusFilter} class="filter-select">
					<option value="TODOS">Estado: Todos</option>
					<option value="ACTIVO">Estado: Activo</option>
					<option value="BANEADO">Estado: Baneado</option>
					<option value="INACTIVO">Estado: Inactivo</option>
				</select>
				<div class="filter-arrow">▼</div>
			</div>
		</div>

		{#if loading}
			<p>Cargando jugadores...</p>
		{:else if error}
			<p style="color: red;">Error: {error}</p>
			<button on:click={loadPlayers} class="btn btn-primary">Reintentar Carga</button>
		{:else if filteredPlayers.length === 0}
			<p>No se encontraron jugadores que coincidan con los criterios.</p>
		{/if}

		{#if filteredPlayers.length > 0}
			<div class="players-table">
				<div class="table-header">
					<div>Usuario</div>
					<div>Estado</div>
					<div>Acciones</div>
				</div>

				{#each filteredPlayers as player}
					<div class="table-row">
						<div class="username">{player.username}</div>
						<div
							class="status"
							style="padding-inline: 1rem;"
							class:active={player.status === 'ACTIVO'}
						>
							{player.status}
						</div>
						<div class="actions">
							{#if player.status === 'ACTIVO'}
								<button class="btn-small btn-ban" on:click={() => toggleBan(player.id, true)}>
									{processingId === player.id ? 'Baneando...' : 'Banear'}
								</button>
							{:else if player.status === 'BANEADO'}
								<button class="btn-small btn-edit" on:click={() => toggleBan(player.id, false)}>
									{processingId === player.id ? 'Desbaneando...' : 'Desbanear'}
								</button>
							{:else}
								<button class="btn-small btn-secondary" disabled> N/A </button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	/* ... (Se mantiene el CSS sin cambios) ... */
	.player-panel {
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

	.search-filter-section {
		display: flex;
		gap: 20px;
		margin-bottom: 30px;
		flex-wrap: wrap;
		align-items: center;
	}

	.search-box {
		position: relative;
		flex: 1;
		min-width: 250px;
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

	.filter-box {
		position: relative;
		min-width: 200px;
	}

	.filter-select {
		width: 100%;
		padding: 12px 40px 12px 12px;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		font-size: 16px;
		background-color: white;
		cursor: pointer;
		appearance: none;
		transition: border-color 0.3s ease;
	}

	.filter-select:focus {
		outline: none;
		border-color: #3498db;
	}

	.filter-arrow {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #7f8c8d;
		font-size: 12px;
		pointer-events: none;
	}

	.players-table {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
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

	.table-row {
		display: contents;
	}

	.table-row > div {
		padding: 15px 0;
		border-bottom: 1px solid #ecf0f1;
		display: flex;
		align-items: center;
	}

	.username {
		font-weight: 600;
		color: #2c3e50;
		font-size: 16px;
	}

	.status {
		justify-content: center;
		width: fit-content;
		border-radius: 10px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		background-color: #95a5a6;
		color: white;
		padding-inline: 10px;
	}

	.status.active {
		background-color: #27ae60;
	}

	.actions {
		display: flex;
		gap: 8px;
	}

	.btn-small {
		padding: 6px 12px;
		border: none;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-edit {
		background-color: #f39c12;
		color: white;
	}

	.btn-edit:hover {
		background-color: #e67e22;
	}

	.btn-ban {
		background-color: #e74c3c;
		color: white;
	}

	.btn-ban:hover {
		background-color: #c0392b;
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
