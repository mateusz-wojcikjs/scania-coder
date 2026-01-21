import { AuthUser } from "./authUser.types";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  authJwtToken: string;
  user: AuthUser;
}

export interface RemindPasswordData {
  email: string;
}

export interface RemindPasswordResponse {
  message: string;
}