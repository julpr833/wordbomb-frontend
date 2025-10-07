<script lang="ts">
  import { slide } from "svelte/transition";

  const TABS = {
    LOGIN: 0,
    REGISTER: 1,
  };

  let selectedTab = TABS.LOGIN;
  let authDialog: HTMLDialogElement;

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
</script>

<button
  on:click={handleModalOpen}
  class="justify-self-end text-white bg-orange-400 py-1.5 px-3 rounded-sm font-display text-xl hover:bg-orange-300 transition-colors duration-200 shadow-sm shadow-blue-950 inset-shadow-sm inset-shadow-orange-200 cursor-pointer"
  >Ingresar</button
>

<dialog
  bind:this={authDialog}
  on:close={handleModalClose}
  closedby="any"
  class="fixed m-auto backdrop:bg-blue-950/50 bg-transparent shadow-[2px_2px_10px_rgba(0,0,0,0.35)] min-w-1/4 opacity-0 transition-opacity duration-300 ease-in-out"
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
    <form
      method="POST"
      action="/api/auth/login"
      class="p-4 bg-gradient-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] flex justify-center min-w-full content-box rounded-b-md"
      transition:slide
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
  {:else}
    <form
      method="POST"
      action="/api/auth/login"
      class="p-4 bg-gradient-to-br from-[#0B192C] via-[#11243d] to-[#0B192C] flex justify-center min-w-full content-box rounded-b-md"
      transition:slide
    >
      <fieldset
        class="min-w-10/12 flex flex-col gap-2 items-center text-center text-white"
      >
        <legend
          class="font text-orange-100 opacity-90 text-2xl mb-2 font-display-header"
          >Crea una cuenta</legend
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
            for="email"
            class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
            >Correo electrónico</label
          >
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
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
        <div class="flex flex-col min-w-full">
          <label
            for="password-confirmation"
            class="font-display self-start -mb-2 mx-1 opacity-80 text-orange-400"
            >Confirmar contraseña</label
          >
          <input
            type="password"
            name="password-confirmation"
            id="password-confirmation"
            placeholder="Confirmar contraseña"
            class="min-w-full outline outline-white/70 rounded-md px-2 py-1.5 my-2 focus:outline-[#FF6500] transition-all duration-250 placeholder:text-sm font-mono"
            required
          />
        </div>
        <button
          type="submit"
          class="min-w-2/3 mt-2 bg-orange-400 py-1 px-3 rounded-sm font-display text-xl hover:bg-orange-300 transition-colors duration-200 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] cursor-pointer inset-shadow-sm inset-shadow-orange-200"
          >Registrar</button
        >
      </fieldset>
    </form>
  {/if}
</dialog>
