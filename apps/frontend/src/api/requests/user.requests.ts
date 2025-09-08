import { api } from "../api.ts";
import { LoginResponse } from "@scania-coder/types";

interface SetupPasswordData {
  token: string;
  password: string;
}

export const setupPassword = async (payload: SetupPasswordData): Promise<LoginResponse> => {
  const { data } = await api.post("/invitation/setup-password", payload);

  return data;
}; 