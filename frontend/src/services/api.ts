import axios, { type AxiosInstance, AxiosError } from "axios";
import type {
  AuditLog,
  AuthResponse,
  RobotMap,
  RobotStatus,
  SensorData,
  User,
} from "../types";

class ApiService {
  private api: AxiosInstance;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.api = axios.create({
      baseURL:
        `${import.meta.env.VITE_API_BASE_URL}/api` ||
        "http://localhost:3000/api",
      timeout: 10000,
    });

    // Request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("Network Error")
        ) {
          return this.handleConnectionError(error);
        }

        if (error.response?.status === 401) {
          const currentPath = window.location.pathname;

          const isAuthPage =
            currentPath === "/login" || currentPath === "/signup";

          if (!isAuthPage) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async handleConnectionError(error: AxiosError): Promise<any> {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.pow(2, this.retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.api.request(error.config!);
    }
    this.retryCount = 0;
    throw new Error("Connection lost. Please check your network.");
  }

  // Authentication
  async register(
    forename: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await this.api.post("/auth/signup", {
      forename,
      email,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post("/auth/signin", {
      email,
      password,
    });
    if (response.data.success && response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Robot endpoints
  async getRobotStatus(): Promise<RobotStatus> {
    const response = await this.api.get("/robot/status");
    return response.data.data;
  }

  async moveRobot(x: number, y: number): Promise<any> {
    const response = await this.api.post("/robot/move", { x, y });
    return response.data;
  }

  async resetRobot(): Promise<any> {
    const response = await this.api.post("/robot/reset");
    return response.data;
  }

  async getRobotMap(): Promise<RobotMap> {
    const response = await this.api.get("/robot/map");
    return response.data.data;
  }

  async getSensorData(): Promise<SensorData> {
    const response = await this.api.get("/robot/sensor");
    return response.data.data;
  }

  async getAuditLogs(page = 1, limit = 10): Promise<AuditLog> {
    const response = await this.api.get(`/audit?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get("/users");
    return response.data;
  }

  async updateUserRole(id: string, role: "COMMANDER" | "VIEWER"): Promise<any> {
    const response = await this.api.patch(`/users/${id}/role`, { role });
    return response.data;
  }
}

export default new ApiService();
