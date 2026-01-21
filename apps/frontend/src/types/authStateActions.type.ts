import { AuthReducerAction } from "enums";
import { AuthContextState } from "interfaces/common";

export type AuthReducerActions = { type: AuthReducerAction.Login; payload: AuthContextState } | { type: AuthReducerAction.Logout; payload: null };