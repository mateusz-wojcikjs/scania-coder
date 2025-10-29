import { AuthReducerAction } from "../enums";
import { AuthContextState } from "../interfaces/common";
import { AuthReducerActions } from "types";

export const authReducer = (state: AuthContextState, action: AuthReducerActions): AuthContextState => {
  switch (action.type) {
  case AuthReducerAction.Login:
    return {
      ...state,
      user: action.payload,
    };
  case AuthReducerAction.Logout:
    return {
      ...state,
      user: null,
    };
  default:
    return state;
  }
};
