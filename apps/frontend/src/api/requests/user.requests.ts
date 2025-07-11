import { api } from "../api.ts";

interface SetupPasswordData {
  token: string;
  password: string;
}

export const setupPassword = async (payload: SetupPasswordData): Promise<void> => {
  const { data } = await api.post("/users/setup-password", payload);

  return data;
}; 