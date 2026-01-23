import { AuthContext, AuthDispatchContext } from "../contexts";
import { AuthContextState } from "interfaces/common/authContextState.interface";
import { Dispatch, useContext } from "react";
import { AuthReducerActions } from "types";
import { UseLocalStorage, useLocalStorage } from "./useLocalStorage.hook";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UseAuth } from "../interfaces";
import { AuthReducerAction, LocalStorageKey, RoutingPath } from "../enums";
import { AuthUser } from "@scania-coder/types";
import { setAuthToken } from "../api";

const TIMEOUT_DELAY: number = 0;

export const useAuth: () => UseAuth = (): UseAuth => {
  const state: AuthContextState = useContext(AuthContext);
  const dispatch: Dispatch<AuthReducerActions> = useContext(AuthDispatchContext);
  const [, storeAuthData]: UseLocalStorage<AuthContextState | null> = useLocalStorage<AuthContextState | null>(LocalStorageKey.AuthData, null);
  const navigate: NavigateFunction = useNavigate();

  const signIn = (userData: AuthUser, token: string, expiration: number): void => {
    setAuthToken(token);
    dispatch({ type: AuthReducerAction.Login, payload: { user: { ...userData }, token, expiration } });
    storeAuthData({ user: { ...userData }, token, expiration });
  };

  const signOutCleanup: () => void = (): void => {
    setAuthToken(null);
    storeAuthData(null);
    dispatch({ type: AuthReducerAction.Logout, payload: null });
    setTimeout((): void => navigate(RoutingPath.Login), TIMEOUT_DELAY);
  };

  const signOut: () => void = (): void => {
    signOutCleanup();
  };

  return {
    signIn,
    signOut,
    signOutCleanup,
    isUserLoggedIn: !!state?.user?.email && !!state.token,
    token: state?.token ?? null,
    expiration: state?.expiration ?? null,
    userData: state?.user ?? null
  };
};
