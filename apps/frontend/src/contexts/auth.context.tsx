import { createContext } from "react";
import { AuthContextState } from "interfaces";

export const AuthContext = createContext<AuthContextState>({
  user: null,
  token: null,
  expiration: null,
});