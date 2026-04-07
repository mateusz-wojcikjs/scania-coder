import { UpdatePayload } from "@scania-coder/types";

export interface LayoutEditFormValues {
  layoutName: string;
  updates: UpdatePayload[];
  cableList: UpdatePayload[];
}