import { createContext, Dispatch } from "react";
import { AuthReducerActions } from "types";

export const AuthDispatchContext = createContext<Dispatch<AuthReducerActions>>(() => {});
