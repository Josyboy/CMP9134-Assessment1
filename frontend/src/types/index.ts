// src/types/index.ts
export interface RobotStatus {
  position: {
    x: number;
    y: number;
  };
  battery: number;
  status: string;
  speed: number;
  payload: number;
  temperature: number;
}

export interface RobotMap {
  width: number;
  height: number;
  grid: number[][];
}

export interface SensorData {
  proximity: number;
  light: number;
  sound: number;
  temperature: number;
  humidity: number;
}

export type AuditEntry = {
  _id: string;
  userEmail: string | null;
  userForename: string | null;
  userRole: string | null;
  action: string;
  payload: Record<string, unknown>;
  success: boolean;
  errorMessage: string | null;
  createdAt: string;
};

export interface AuditLog {
  success: boolean;
  message: string;
  data: AuditEntry[];
  pagination: {
    totalEntries: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface User {
  _id: string;
  forename: string;
  email: string;
  role: "COMMANDER" | "VIEWER";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface TelemetryData {
  battery?: number;
  status?: string;
  position?: {
    x: number;
    y: number;
  };
  sensors?: {
    E: number;
    N: number;
    S: number;
    W: number;
    lidar?: number[];
  };
}
