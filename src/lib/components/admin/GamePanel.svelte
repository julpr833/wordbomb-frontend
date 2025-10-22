<script>
  import { getContext } from 'svelte';
  
  const adminTab = getContext('adminTab');
  
  // Datos de ejemplo para el panel de juego
  let gameStats = {
    activeRooms: 5,
    totalPlayers: 23,
    gamesPlayed: 156,
    averageGameTime: '3:45'
  };
  
  // Gestión de palabras
  let words = [
    { id: 1, word: 'Goma', category: 'Objetos' },
    { id: 2, word: 'Dar', category: 'Verbos' },
    { id: 3, word: 'Sostenido', category: 'Música' },
    { id: 4, word: 'Casa', category: 'Lugares' },
    { id: 5, word: 'Agua', category: 'Naturaleza' }
  ];
  
  let searchQuery = '';
  let filteredWords = words;
  let showAddForm = false;
  let newWord = { word: '', category: '' };
  
  $: {
    if (searchQuery) {
      filteredWords = words.filter(word => 
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filteredWords = words;
    }
  }
  
  function addWord() {
    if (newWord.word && newWord.category) {
      words = [...words, { 
        id: Date.now(), 
        word: newWord.word, 
        category: newWord.category 
      }];
      newWord = { word: '', category: '' };
      showAddForm = false;
    }
  }
  
  function deleteWord(id) {
    words = words.filter(word => word.id !== id);
  }
  
  function editWord(id) {
    // Implementar edición de palabra
    console.log('Editar palabra:', id);
  }
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
    <div class="words-section">
      <h3>Palabras</h3>
      
      <div class="words-table">
        <div class="table-header">
          <div>Palabra</div>
          <div>Categoría</div>
          <div>Acciones</div>
        </div>
        
        {#each filteredWords as word}
          <div class="table-row">
            <div class="word-text">{word.word}</div>
            <div class="word-category">{word.category}</div>
            <div class="word-actions">
              <button class="btn-small btn-edit" on:click={() => editWord(word.id)}>
                Editar
              </button>
              <button class="btn-small btn-delete" on:click={() => deleteWord(word.id)}>
                Eliminar
              </button>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Formulario para agregar palabra -->
      {#if showAddForm}
        <div class="add-word-form">
          <h4>Agregar Nueva Palabra</h4>
          <div class="form-row">
            <input 
              type="text" 
              placeholder="Palabra" 
              bind:value={newWord.word}
              class="form-input"
            />
            <input 
              type="text" 
              placeholder="Categoría" 
              bind:value={newWord.category}
              class="form-input"
            />
            <button class="btn btn-primary" on:click={addWord}>
              Agregar
            </button>
            <button class="btn btn-secondary" on:click={() => showAddForm = false}>
              Cancelar
            </button>
          </div>
        </div>
      {/if}
      
      <!-- Botón para agregar palabra -->
      <div class="add-button-section">
        <button class="btn btn-primary add-word-btn" on:click={() => showAddForm = true}>
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
  
  .word-text {
    font-weight: 600;
    color: #2c3e50;
    font-size: 16px;
  }
  
  .word-category {
    color: #7f8c8d;
    font-size: 14px;
  }
  
  .word-actions {
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
  
  .btn-delete {
    background-color: #e74c3c;
    color: white;
  }
  
  .btn-delete:hover {
    background-color: #c0392b;
  }
  
  .add-word-form {
    background-color: #f8f9fa;
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
