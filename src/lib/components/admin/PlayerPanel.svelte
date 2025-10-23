<script>
  import { getContext } from 'svelte';
  
  const adminTab = getContext('adminTab');
  
  // Datos de ejemplo para el panel de jugadores
  let players = [
    { id: 1, username: 'Ana', score: 1200, games: 35, status: 'ACTIVO' },
    { id: 2, username: 'Carlos', score: 980, games: 28, status: 'ACTIVO' },
    { id: 3, username: 'María', score: 1450, games: 42, status: 'INACTIVO' },
    { id: 4, username: 'Luis', score: 1100, games: 31, status: 'ACTIVO' },
    { id: 5, username: 'Sofia', score: 1350, games: 38, status: 'ACTIVO' }
  ];
  
  let searchQuery = '';
  let statusFilter = 'ACTIVO';
  let filteredPlayers = players;
  let showAddForm = false;
  let newPlayer = { username: '', score: 0, games: 0, status: 'ACTIVO' };
  
  $: {
    let filtered = players;
    
    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(player => player.status === statusFilter);
    }
    
    filteredPlayers = filtered;
  }
  
  function addPlayer() {
    if (newPlayer.username) {
      players = [...players, { 
        id: Date.now(), 
        username: newPlayer.username,
        score: newPlayer.score,
        games: newPlayer.games,
        status: newPlayer.status
      }];
      newPlayer = { username: '', score: 0, games: 0, status: 'ACTIVO' };
      showAddForm = false;
    }
  }
  
  function banPlayer(id) {
    players = players.map(player => 
      player.id === id ? { ...player, status: 'BANEADO' } : player
    );
  }
  
  function editPlayer(id) {
    // Implementar edición de jugador
    console.log('Editar jugador:', id);
  }
</script>

<div class="player-panel">
  <div class="panel-header">
    <h2>Panel de Jugadores</h2>
    <p>Gestiona y monitorea la actividad de los jugadores</p>
  </div>
  
  <div class="content-card">
    <!-- Barra de búsqueda y filtros -->
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
          <option value="INACTIVO">Estado: Inactivo</option>
          <option value="BANEADO">Estado: Baneado</option>
        </select>
        <div class="filter-arrow">▼</div>
      </div>
    </div>
    
    <!-- Tabla de jugadores -->
    <div class="players-table">
      <div class="table-header">
        <div>Usuario</div>
        <div>Puntaje</div>
        <div>Partidas</div>
        <div>Estado</div>
        <div>Acciones</div>
      </div>
      
      {#each filteredPlayers as player}
        <div class="table-row">
          <div class="username">{player.username}</div>
          <div class="score">{player.score}</div>
          <div class="games">{player.games}</div>
          <div class="status" class:active={player.status === 'ACTIVO'}>
            {player.status}
          </div>
          <div class="actions">
            <button class="btn-small btn-edit" on:click={() => editPlayer(player.id)}>
              Editar
            </button>
            <button class="btn-small btn-ban" on:click={() => banPlayer(player.id)}>
              Banear
            </button>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Formulario para agregar jugador -->
    {#if showAddForm}
      <div class="add-player-form">
        <h4>Agregar Nuevo Jugador</h4>
        <div class="form-row">
          <input 
            type="text" 
            placeholder="Nombre de usuario" 
            bind:value={newPlayer.username}
            class="form-input"
          />
          <input 
            type="number" 
            placeholder="Puntaje inicial" 
            bind:value={newPlayer.score}
            class="form-input"
          />
          <input 
            type="number" 
            placeholder="Partidas jugadas" 
            bind:value={newPlayer.games}
            class="form-input"
          />
          <select bind:value={newPlayer.status} class="form-select">
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
          <button class="btn btn-primary" on:click={addPlayer}>
            Agregar
          </button>
          <button class="btn btn-secondary" on:click={() => showAddForm = false}>
            Cancelar
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Botón para agregar jugador -->
    <div class="add-button-section">
      <button class="btn btn-primary add-player-btn" on:click={() => showAddForm = true}>
        <span class="plus-icon">+</span>
        Agregar Jugador
      </button>
    </div>
  </div>
</div>

<style>
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
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
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
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
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
  
  .score {
    color: #2c3e50;
    font-weight: 600;
    font-size: 16px;
  }
  
  .games {
    color: #7f8c8d;
    font-size: 14px;
  }
  
  .status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    background-color: #95a5a6;
    color: white;
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
  
  .add-player-form {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .add-player-form h4 {
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
  
  .form-select {
    padding: 8px 12px;
    border: 2px solid #ecf0f1;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
    min-width: 120px;
  }
  
  .form-select:focus {
    outline: none;
    border-color: #3498db;
  }
  
  .add-button-section {
    text-align: center;
  }
  
  .add-player-btn {
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
  
  .add-player-btn:hover {
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
