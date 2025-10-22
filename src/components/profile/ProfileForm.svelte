<script lang="ts">
  import { blur } from "svelte/transition";
  import { authStore } from "../../stores/auth";

  $: user = $authStore.user;

  let imageLoaded = false;
</script>

<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
  <h2
    class="text-2xl text-center font-bold text-orange-300 tracking-wide font-display-header mb-6"
  >
    Perfil
  </h2>

  <!-- Foto de perfil -->
  <figure class="flex flex-col items-center">
    <div
      class="relative overflow-hidden w-32 h-32 text-transparent rounded-full bg-gradient-to-br from-orange-900 via-orange-500 to-orange-950 object-cover my-2"
    >
      <img
        src={user?.avatar}
        alt={user?.username}
        class="transition-opacity duration-300 absolute {imageLoaded
          ? 'opacity-100'
          : 'opacity-0'}"
        on:load={() => (imageLoaded = true)}
      />
    </div>
    <figcaption>
      <p
        class="w-full text-orange-300 font-bold"
        placeholder="Ingresa tu email"
      >
        {user?.email}
      </p>
    </figcaption>
  </figure>

  <!-- Formulario -->
  <form class="space-y-4">
    <!-- Username -->
    <div>
      <div class="mb-2">
        <label class="block text-white text-sm font-medium mb-2" for="username"
          >Nombre de usuario</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="username"
            value={user?.username}
            class="w-full pl-10 pr-10 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900"
            placeholder="Ingresa tu nuevo nombre de usuario..."
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="flex flex-row gap-2">
        <div class="w-full">
          <label
            class="block text-white text-sm font-medium mb-2"
            for="password">Contraseña</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              class="w-full pl-10 pr-10 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900"
              placeholder="Contraseña..."
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="w-full">
          <label
            class="block text-white text-sm font-medium mb-2"
            for="password_confirmation">Confirmar contraseña</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              class="w-full pl-10 pr-10 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900"
              placeholder="Otra vez..."
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Email -->
    </div>

    <!-- Botón de guardar -->
    <div class="flex justify-center pt-4">
      <button
        type="submit"
        class="text-white min-w-1/3 mt-2 bg-orange-400 py-2 px-3 rounded-sm font-display text-xl hover:bg-orange-300 transition-colors duration-200 shadow-[2px_2px_10px_rgba(0,0,0,0.35)] cursor-pointer inset-shadow-sm inset-shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Guardar Cambios
      </button>
    </div>
  </form>
</div>
