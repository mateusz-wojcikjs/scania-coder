import { FC, ReactNode, useReducer } from "react";
import { AuthContextData } from "./authContextProvider.types";
import { authReducer } from "../reducers/auth.reducer.ts";
import { UseLocalStorage, useLocalStorage } from "../hooks/useLocalStorage.hook.ts";
import { AuthContextState } from "interfaces/common/authContextState.interface";
import { AuthContext, AuthDispatchContext } from "../contexts";

export interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = (props: AuthContextProviderProps): JSX.Element => {
  const { children }: AuthContextProviderProps = props;
  const [authData]: UseLocalStorage<AuthContextState> = useLocalStorage<AuthContextState>("authData", {
    user: null,
    isAuthenticated: false,
    token: null,
    expiration: null,
  });
  const [authState, authDispatch]: AuthContextData = useReducer(authReducer, authData ? authData : {
    user: null,
    isAuthenticated: false,
    token: null,
    expiration: null,
  });

  return (
    <AuthDispatchContext.Provider value={authDispatch}>
      <AuthContext.Provider value={authState}>
        {children}
      </AuthContext.Provider>
    </AuthDispatchContext.Provider>
  );
};
