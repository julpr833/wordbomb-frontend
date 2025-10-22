<script lang="ts">
  import { blur, fade } from "svelte/transition";
  import { authActions } from "../../../stores/auth";
  import { authService } from "../../../services";

  // Props
  export let authDialog: HTMLDialogElement;

  // Constants
  const TABS = {
    LOGIN: 0,
    REGISTER: 1,
  };

  let selectedTab = TABS.LOGIN;

  // Bindings
  let form: HTMLFormElement;
  let isLoading = false;
  let errorMessage = "";

  // Functions
  function handleModalOpen() {
    authDialog.showModal();
    authDialog.classList.remove("opacity-0");
  }

  async function handleFormSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    errorMessage = "";

    const formData = new FormData(form);
    const credentials = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    try {
      const result = await authService.login(credentials);
      if (result.user && result.token) {
        // Update auth store
        authActions.login(result.user, result.token);

        // Close modal
        authDialog.close();

        // Reset form
        form.reset();
      } else {
        errorMessage = result.message || "Error al iniciar sesión";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
    } finally {
      isLoading = false;
    }
  }

  let tabChangerAfterOffset = 0;

  async function handleTabChange(e: MouseEvent) {
    if (e.target instanceof HTMLButtonElement) {
      selectedTab = e.target.id === "login-tab" ? TABS.LOGIN : TABS.REGISTER;
      const tabChanger = document.getElementById("tab-changer");
      if (tabChanger === null) return;
      tabChangerAfterOffset = e.target.id === "login-tab" ? 0 : 50;
    }
  }
</script>

<form
  class="p-4 bg-gradient-to-br flex justify-center min-w-full content-box rounded-b-md"
  in:blur
  out:fade={{ duration: 0 }}
  bind:this={form}
  on:submit={handleFormSubmit}
>
  <fieldset
    class="min-w-10/12 flex flex-col gap-2 items-center text-center text-white"
    disabled={isLoading}
  >
    <legend
      class="font text-orange-100 opacity-90 text-2xl mb-2 font-display-header"
      >Ingresa a tu cuenta</legend
    >

    <div class="flex flex-col min-w-full">
      <label
        for="username"
        class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
        >Usuario</label
      >
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Usuario"
        class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
        required
        disabled={isLoading}
      />
    </div>
    <div class="flex flex-col min-w-full">
      <label
        for="password"
        class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
        >Contraseña</label
      >
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Contraseña"
        class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
        required
        disabled={isLoading}
      />
    </div>
    {#if errorMessage}
      <span class="text-red-400 text-sm">{errorMessage}</span>
    {/if}
    <button
      type="submit"
      class="min-w-2/3 mt-2 bg-orange-400 py-1 px-3 rounded-sm font-display text-xl hover:bg-orange-300 transition-colors duration-200 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] cursor-pointer inset-shadow-sm inset-shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {#if isLoading}
        <span class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
          Iniciando sesión...
        </span>
      {:else}
        Ingresar
      {/if}
    </button>
  </fieldset>
</form>
