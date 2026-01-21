import { api } from "../api";
import { PaginatedResponse, User } from "@scania-coder/types";
import { AxiosResponse } from "axios";

export const getUsers = async (): Promise<PaginatedResponse<User>> => {
  const { data }: AxiosResponse<PaginatedResponse<User>> = await api.get<PaginatedResponse<User>>("/users");

  return data;
};

export const addUser = async (values: unknown): Promise<void> => {
  const { data } = await api.post("/users", values);

  return data;
};

// todo: move it to invitation.requests.ts
export const deactivateUser = async (id: number): Promise<void> => {
  const { data } = await api.patch(`/users/${id}/deactivate`);

  return data;
};

export const getUser = async (id: number): Promise<User> => {
  const { data }: AxiosResponse<User> = await api.get<User>(`/users/${id}`);

  return data;
};

export const updateUser = async (id: number, updateData: Partial<User>): Promise<User> => {
  const { data } = await api.patch(`/users/${id}`, updateData);

  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  const { data } = await api.delete(`/users/${id}`);

  return data;
};