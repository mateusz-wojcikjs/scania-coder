import { AuthUser } from "@scania-coder/types";

export interface AuthContextState {
  user: AuthUser | null;
  token: string | null;
  expiration: number | null;
}
