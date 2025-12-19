import { User } from "@scania-coder/types";

export interface AuthContextState {
  user: User | null;
  token: string | null;
  expiration: number | null;
}
