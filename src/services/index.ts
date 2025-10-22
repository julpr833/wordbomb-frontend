import { AuthService } from "./authService";

// Create singleton instance for easy use across the app
export const authService = new AuthService();

// Export types for convenience
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "./authService";
