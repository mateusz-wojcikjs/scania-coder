import { api } from "../api.ts";
import { LoginResponse } from "@scania-coder/types";
import { SetupPasswordData } from "../../interfaces/index.ts";

export const setupPassword = async (payload: SetupPasswordData): Promise<LoginResponse> => {
  const { data } = await api.post("/invitation/setup-password", payload);

  return data;
}; 

export const cancelInvitation = async (userId: number): Promise<void> => {
  const { data } = await api.patch(`/invitation/${userId}/cancel`);

  return data;
};

export const resendInvitation = async (userId: number): Promise<void> => {
  const { data } = await api.post(`/invitation/${userId}/resend`);

  return data;
};