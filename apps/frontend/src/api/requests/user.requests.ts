import { api } from "../api.ts";
import { LoginResponse } from "@scania-coder/types";
import { SetupPasswordData } from "../../interfaces";

export const setupPassword = async (payload: SetupPasswordData): Promise<LoginResponse> => {
  const { data } = await api.post("/invitation/setup-password", payload);

  return data;
}; 