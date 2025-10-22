<script lang="ts">
  import { onMount } from "svelte";
  import { authStore, authActions } from "../stores/auth";

  let isAuthenticated = false;
  let isLoading = true;

  onMount(() => {
    // Initialize auth store (loads from localStorage)
    authActions.initialize();

    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe((state) => {
      isAuthenticated = state.isAuthenticated;
      isLoading = false;

      // If not authenticated, redirect to main page
      if (!isAuthenticated && !isLoading) {
        window.location.href = "/";
      }
    });

    // Cleanup subscription on component destroy
    return unsubscribe;
  });
</script>

{#if isAuthenticated}
  <slot />
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"
    ></div>
  </div>
{/if}
