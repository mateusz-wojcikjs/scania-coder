import { api } from "../api.ts";
import { LoginData, LoginResponse, RemindPasswordData, RemindPasswordResponse } from "@scania-coder/types";
import { AxiosResponse } from "axios";

export const login: (body: LoginData) => Promise<LoginResponse> = async (body: LoginData): Promise<LoginResponse> => {
  const { data }: AxiosResponse<LoginResponse> = await api.post<LoginResponse>("/login", body);

  return data;
};

export const remindPassword: (body: RemindPasswordData) => Promise<RemindPasswordResponse> = async (body: RemindPasswordData): Promise<RemindPasswordResponse> => {
  const { data }: AxiosResponse<RemindPasswordResponse> = await api.post<RemindPasswordResponse>("/remind-password", body);

  return data;
};

export const changePassword = async (password: string): Promise<void> => {
  await api.patch("/change-password", { password });
};
