import { createContext } from "react";
import { AuthContextState } from "interfaces/common/authContextState.interface";

export const AuthContext = createContext<AuthContextState>({
  user: null,
  isAuthenticated: false,
  token: null,
  expiration: null,
});