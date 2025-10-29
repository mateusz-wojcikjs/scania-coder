import { api } from "../api";
import { User } from "../../interfaces";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");

  return data;
};
