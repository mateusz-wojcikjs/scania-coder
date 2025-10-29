import { AuthContext } from "contexts";
import { AuthContextState } from "interfaces/common/authContextState.interface";
import { Dispatch, useContext } from "react";
import { AuthReducerActions } from "types";
import { UseLocalStorage, useLocalStorage } from "./useLocalStorage.hook";
import { AuthReducerAction, LocalStorageKey } from "enums";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { UseRedirect } from "interfaces/hooks";
import { useRedirect } from "./useRedirect.hook";

export interface UseAuth {
    signIn: (userData: User, token: string, expiration: number) => void;
    signOut: (redirectPath?: string, withRedirect?: boolean) => void;
    signOutCleanup: (redirectPath?: string) => void;
    isUserLoggedIn: () => boolean;
    updateUserData: (userData: Partial<User>) => void;
    token: string | null;
    expiration: number | null;
    userData: User | null;
  }

export const useAuth = () => {
  const state: AuthContextState = useContext(AuthContext);
  const dispatch: Dispatch<AuthReducerActions> = useContext(AuthDispatchContext);

  const [, storeAuthData]: UseLocalStorage<AuthContextState | null> = useLocalStorage<AuthContextState | null>(LocalStorageKey.AuthData, null);
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { redirect }: UseRedirect = useRedirect();

  const signIn: (

        userData: User, token: string, expiration: number
    
      ) => void = (
    
        userData: User, token: string, expiration: number
    
      ): void => {
    
        setAuthToken(token);
    
        dispatch({ type: AuthReducerAction.SignIn, payload: { userData, token, expiration } });
    
        storeAuthData({ userData, token, expiration });
    
    
    
        const pathnameAfterSignIn: string = (location.state as LocationState)?.from?.pathname
    
          ? (location.state as LocationState)?.from?.pathname
    
          : getRouteDetailsByName(RouteNameEnum.Subscriptions)?.url ?? '/';
    
    
        redirect({ targetRoute: pathnameAfterSignIn });
    
      };
    
    
  const signOutCleanup: (redirectPath?: string, withRedirect?: boolean) => void = (
    redirectPath?: string, withRedirect: boolean = true
  ): void => {
    dispatch({ type: AuthReducerAction.SignOut, payload: null });
    storeAuthData(null);
    setAuthToken(null);
    
    if (withRedirect) {
      setTimeout((): void => navigate(redirectPath ?? getRouteDetailsByName(RouteNameEnum.Home)?.url ?? '/'), 0);
    }
  };
    
  const signOut: (redirectPath?: string, withRedirect?: boolean) => void = (
    redirectPath?: string, withRedirect: boolean = true
  ): void => {
    if (state.expiration && state.expiration > Date.now()) {
      void logoutRequest()
        .then((): void => signOutCleanup(redirectPath, withRedirect))
        .catch((): void => signOutCleanup(redirectPath, withRedirect));
    
    } else {
    
      signOutCleanup(redirectPath, withRedirect);
    
    }
    
  };
    
    
  const isUserLoggedIn: () => boolean = (): boolean => {
    
    return !!state?.userData?.hash && !!state.token;
    
  };
    
    
  const updateUserData: (userData: Partial<User>) => void = (userData: Partial<User>): void => {
    
    dispatch({ type: AuthReducerAction.UpdateUserData, payload: userData });
    
    if (state.userData) {
    
      storeAuthData({
    
        userData: { ...state.userData, ...userData },
    
        token: state.token, expiration:
    
            state.expiration
    
      });
    
    }
    
  };
    
    
  return {
    signIn,
    signOut,
    signOutCleanup,
    isUserLoggedIn,
    updateUserData,
    token: state?.token ?? null,
    expiration: state?.expiration ?? null,
    userData: state?.userData ?? null
  };
};