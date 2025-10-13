<script lang="ts">
  import { blur, fade } from "svelte/transition";

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

  // Functions
  function handleModalOpen() {
    authDialog.showModal();
    authDialog.classList.remove("opacity-0");
  }

  function handleModalClose() {
    authDialog.classList.add("opacity-0");
  }

  async function handleFormSubmit(e: Event) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:7777/api/auth/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
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
      />
    </div>
    <button
      type="submit"
      class="min-w-2/3 mt-2 bg-orange-400 py-1 px-3 rounded-sm font-display text-xl hover:bg-orange-300 transition-colors duration-200 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] cursor-pointer inset-shadow-sm inset-shadow-orange-200"
      >Ingresar</button
    >
  </fieldset>
</form>
