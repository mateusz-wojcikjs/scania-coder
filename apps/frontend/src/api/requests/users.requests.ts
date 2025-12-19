import { api } from "../api";
import { PaginatedUsersResponse, User } from "@scania-coder/types";
import { AxiosResponse } from "axios";

export const getUsers = async (): Promise<PaginatedUsersResponse> => {
  const { data }: AxiosResponse<PaginatedUsersResponse> = await api.get<PaginatedUsersResponse>("/users");

  return data;
};

export const addUser = async (values: unknown): Promise<void> => {
  const { data } = await api.post("/users", values);

  return data;
};

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