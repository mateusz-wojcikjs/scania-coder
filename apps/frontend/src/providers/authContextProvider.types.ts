import { AuthContextState } from "interfaces/common";
import { Dispatch } from "react";
import { AuthReducerActions } from "types";

export type AuthContextData = [AuthContextState, Dispatch<AuthReducerActions>];