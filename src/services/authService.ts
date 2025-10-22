import { ApiService } from "../lib/api";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export class AuthService extends ApiService {
  // Configuration for request format
  private readonly USE_FORM_DATA = true; // Set to false if your backend expects JSON

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const requestKey = `login-${credentials.username}`;

    // Debug logging
    console.log("Sending login data:", {
      username: credentials.username,
      password: "[HIDDEN]",
    });

    return this.request<AuthResponse>(
      "POST",
      "/api/auth/login",
      credentials,
      requestKey,
      {
        useFormData: this.USE_FORM_DATA,
      },
    );
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const requestKey = `register-${userData.username}`;

    // Debug logging
    console.log("Sending registration data:", {
      username: userData.username,
      email: userData.email,
      password: "[HIDDEN]",
    });

    return this.request<AuthResponse>(
      "POST",
      "/api/auth/register",
      userData,
      requestKey,
      {
        useFormData: this.USE_FORM_DATA,
      },
    );
  }

  async logout(): Promise<void> {
    const requestKey = "logout";

    try {
      await this.request("POST", "/api/auth/logout", {}, requestKey);
    } catch (error) {
      console.warn("Logout request failed, but clearing local auth:", error);
    }
  }

  async verifyToken(): Promise<boolean> {
    const requestKey = "verify-token";

    try {
      await this.request("GET", "/api/auth/verify", undefined, requestKey);
      return true;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  }

  // Convenience methods for specific request types
  cancelLoginRequest(username: string): void {
    this.cancelRequest(`login-${username}`);
  }

  cancelRegisterRequest(username: string): void {
    this.cancelRequest(`register-${username}`);
  }

  cancelAuthRequests(): void {
    this.cancelRequest("logout");
    this.cancelRequest("verify-token");
  }
}
