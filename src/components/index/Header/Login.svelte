<script lang="ts">
  import RegisterForm from "./RegisterForm.svelte";
  import LoginForm from "./LoginForm.svelte";
  import Profile from "./Profile.svelte";
  import { authStore, authActions } from "../../../stores/auth";
  import { onMount } from "svelte";

  import { blur } from "svelte/transition";

  const TABS = {
    LOGIN: 0,
    REGISTER: 1,
  };

  let selectedTab = TABS.LOGIN;
  let authDialog: HTMLDialogElement;

  // Reactive auth state
  $: isAuthenticated = $authStore.isAuthenticated;

  function handleModalOpen() {
    authDialog.showModal();
    authDialog.classList.remove("opacity-0");
  }

  function handleModalClose() {
    authDialog.classList.add("opacity-0");
  }

  let tabChangerAfterOffset = 0;

  function handleTabChange(e: MouseEvent) {
    if (e.target instanceof HTMLButtonElement) {
      selectedTab = e.target.id === "login-tab" ? TABS.LOGIN : TABS.REGISTER;
      const tabChanger = document.getElementById("tab-changer");
      if (tabChanger === null) return;
      tabChangerAfterOffset = e.target.id === "login-tab" ? 0 : 50;
    }
  }

  // Initialize auth state on component mount
  onMount(() => {
    authActions.initialize();
  });
</script>

{#if isAuthenticated}
  <!-- Show Profile component when user is logged in -->
  <Profile />
{:else}
  <!-- Show Login button when user is not logged in -->
  <button
    on:click={handleModalOpen}
    in:blur
    class="justify-self-end text-white bg-orange-800 py-1.5 px-3 rounded-sm font-display text-xl hover:bg-orange-600 transition-colors duration-200 shadow-sm shadow-blue-950 inset-shadow-sm inset-shadow-orange-200 cursor-pointer"
    >Ingresar</button
  >
{/if}

<dialog
  bind:this={authDialog}
  on:close={handleModalClose}
  closedby="any"
  class="fixed m-auto backdrop:bg-blue-950/50 backdrop:backdrop-blur-xs bg-gradient-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] shadow-[2px_2px_10px_rgba(0,0,0,0.35)] min-w-1/4 opacity-0 transition-opacity duration-300 ease-in-out"
>
  <div
    id="tab-changer"
    class="flex overflow-hidden bg-[#325276] text-white rounded-t-md relative justify-between inset-shadow-sm inset-shadow-blue-500 after:content-[''] after:absolute after:bottom-0 {selectedTab ===
    TABS.LOGIN
      ? 'after:translate-x-0'
      : 'after:translate-x-full'} after:w-1/2 after:h-0.5 after:bg-white/90 after:transition-transform after:duration-300 after:ease-in-out"
  >
    <button
      id="login-tab"
      class="border-0 border-r border-r-white/10 outline-0 px-3 py-2 cursor-pointer bg bg-transparent font-display text-lg text-white/90 w-full"
      on:click={handleTabChange}>Ingresar</button
    >
    <button
      id="register-tab"
      class="border-0 outline-0 px-3 py-2 cursor-pointer bg bg-transparent font-display text-lg text-white/90 w-full"
      on:click={handleTabChange}>Registrarse</button
    >
  </div>
  {#if selectedTab === TABS.LOGIN}
    <LoginForm {authDialog} />
  {:else}
    <RegisterForm {authDialog} />
  {/if}
</dialog>
