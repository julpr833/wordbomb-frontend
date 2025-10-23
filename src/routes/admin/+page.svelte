<script>
  import { getContext } from 'svelte';
  import GamePanel from '$lib/components/admin/GamePanel.svelte';
  import PlayerPanel from '$lib/components/admin/PlayerPanel.svelte';
  
  const { currentTab } = getContext('adminTab');
</script>

<svelte:head>
  <title>Panel de Administración - WordBomb</title>
</svelte:head>

<div class="admin-page">
  {#if $currentTab === 'game'}
    <GamePanel />
  {:else if $currentTab === 'player'}
    <PlayerPanel />
  {/if}
</div>

<style>
  .admin-page {
    width: 100%;
    height: 100%;
  }
</style>
