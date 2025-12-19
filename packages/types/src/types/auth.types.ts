import { User } from "./user.types";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  authJwtToken: string;
  user: User;
}

export interface RemindPasswordData {
  email: string;
}

export interface RemindPasswordResponse {
  message: string;
}