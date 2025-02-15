import { api } from "../api.ts";
import { LayoutItemData } from "../../types";
import { Layout, LayoutRemove } from "../../interfaces";

export const getLayouts: () => Promise<Layout[]> = async (): Promise<Layout[]> => {
  const { data } = await api.get("/layouts");

  return data;
};

export const getLayoutDetails: (id: number) => Promise<Layout> = async (id: number): Promise<Layout> => {
  const { data } = await api.get(`/layouts/${id}`);

  return data;
};

export const createLayout: (layout: LayoutItemData) => Promise<Layout> = async (layout: LayoutItemData): Promise<Layout> => {
  const { data } = await api.post("/layouts", layout);

  return data;
};

export const deleteLayout: (id: number) => Promise<LayoutRemove> = async (id: number): Promise<LayoutRemove> => {
  const { data } = await api.delete(`/layouts/${id}`);

  return data;
};
