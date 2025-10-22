import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { config } from "../config/env";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiService {
  private activeRequests = new Map<string, AbortController>();
  private axiosInstance: AxiosInstance;

  constructor(
    private baseURL: string = config.apiBaseUrl,
    private timeout: number = 10000,
  ) {
    this.axiosInstance = this.createAxiosInstance();
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
    });

    // Add request interceptor to include auth token
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear auth
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          // You might want to redirect to login or emit an event here
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }

  private getAbortController(requestKey: string): AbortController {
    // Cancel previous request if it exists
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    this.activeRequests.set(requestKey, controller);

    // Clean up when request completes
    controller.signal.addEventListener("abort", () => {
      this.activeRequests.delete(requestKey);
    });

    return controller;
  }

  protected async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    requestKey?: string,
    options?: {
      useFormData?: boolean;
      headers?: Record<string, string>;
    },
  ): Promise<T> {
    const key = requestKey || `${method.toLowerCase()}-${url}`;
    const abortController = this.getAbortController(key);

    try {
      let requestData = data;
      let headers: Record<string, string> = {};

      if (options?.useFormData && data) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        requestData = formData;
        headers["Content-Type"] = "multipart/form-data";
      } else if (data) {
        headers["Content-Type"] = "application/json";
      }

      // Merge custom headers
      if (options?.headers) {
        headers = { ...headers, ...options.headers };
      }

      const response: AxiosResponse<T> = await this.axiosInstance.request({
        method,
        url,
        data: requestData,
        headers,
        signal: abortController.signal,
      });

      // Clean up successful request
      this.activeRequests.delete(key);
      return response.data;
    } catch (error) {
      // Clean up failed request
      this.activeRequests.delete(key);

      console.error(`API ${method} ${url} error:`, error);
      if (axios.isAxiosError(error)) {
        // Check if request was aborted
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          throw new Error("Request was canceled");
        }

        // Debug: Log the full error response
        console.log("Backend error response:", error.response?.data);
        console.log("Backend error status:", error.response?.status);

        // Handle different response formats from your Flask backend
        const errorData = error.response?.data;
        if (errorData?.error) {
          throw new Error(errorData.error);
        } else if (errorData?.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`${method} ${url} failed`);
        }
      }
      throw error;
    }
  }

  // Utility methods
  cancelAllRequests(): void {
    this.activeRequests.forEach((controller) => {
      controller.abort();
    });
    this.activeRequests.clear();
  }

  cancelRequest(requestKey: string): void {
    const controller = this.activeRequests.get(requestKey);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestKey);
    }
  }

  // Clean up method
  destroy(): void {
    this.cancelAllRequests();
  }
}
