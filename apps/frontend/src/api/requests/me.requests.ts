import { api } from "../api";

export const deactivateAccount = async (): Promise<void> => {
  const { data } = await api.patch("/me/deactivate");

  return data;
};