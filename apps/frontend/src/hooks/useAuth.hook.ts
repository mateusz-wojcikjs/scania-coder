import { AuthContext } from "contexts";
import { AuthContextState } from "interfaces/common/authContextState.interface";
import { Dispatch, useContext } from "react";
import { AuthReducerActions } from "types";
import { UseLocalStorage, useLocalStorage } from "./useLocalStorage.hook";
import { LocalStorageKey } from "enums";

export const useAuth = () => {
    const state: AuthContextState = useContext(AuthContext);
    // const dispatch: Dispatch<AuthReducerActions> = useContext(AuthDispatchContext);

    const [, storeAuthData]: UseLocalStorage<AuthContextState | null> = useLocalStorage<AuthContextState | null>(LocalStorageKey.AuthData, null);