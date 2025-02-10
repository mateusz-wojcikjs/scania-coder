import { api } from "../api.ts";
import { LoginData, LoginResponse } from "@scania-coder/types";
import { AxiosResponse } from "axios";

export const login: (body: LoginData) => Promise<LoginResponse> = async (body: LoginData): Promise<LoginResponse> => {
  const { data }: AxiosResponse<LoginResponse> = await api.post<LoginResponse>("/login", body);

  return data;
};
