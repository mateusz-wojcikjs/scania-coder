import { UpdatePayload } from "@scania-coder/types";

export interface Layout {
  id: number;
  name: string;
  updates: UpdatePayload[];
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}
