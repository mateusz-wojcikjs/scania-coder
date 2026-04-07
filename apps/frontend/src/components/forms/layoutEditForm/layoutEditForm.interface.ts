import { UpdatePayload } from "@scania-coder/types";
import { Layout } from "interfaces/api/layout.interface";

export interface LayoutEditFormProps {
  layout: Layout;
  layoutId: number;
  layoutRouteId: string;
}

export interface LayoutEditFormValues {
  layoutName: string;
  updates: UpdatePayload[];
  cableList: UpdatePayload[];
}

export interface LayoutEditFormPayload {
  name: string;
  updates: UpdatePayload[];
}