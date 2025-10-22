import { writable } from "svelte/store";

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Create the auth store
export const authStore = writable<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null,
});

// Auth actions
export const authActions = {
  login: (user: User, token: string) => {
    authStore.update((state) => ({
      ...state,
      isAuthenticated: true,
      user,
      token,
    }));

    // Store in localStorage for persistence
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));
  },

  logout: () => {
    authStore.update((state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      token: null,
    }));

    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    // Redirect to main page
    location.reload();
  },

  initialize: () => {
    // Check for existing auth data in localStorage
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        authStore.update((state) => ({
          ...state,
          isAuthenticated: true,
          user,
          token,
        }));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
  },
};
