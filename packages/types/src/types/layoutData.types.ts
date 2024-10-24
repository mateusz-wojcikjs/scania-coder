import { UpdatePayload } from "./updatePayload.types";

export interface LayoutData {
  id: number;
  name: string;
  updates: UpdatePayload[]
}
