import { User } from "../types";

export type AuthStore = {
  user?: User;
};

export type LoginAction = {
  type: "login";
  payload: User;
};

export type LogoutAction = {
  type: "logout";
};

export const authReducer = (
  state: AuthStore,
  action: LoginAction | LogoutAction
): AuthStore => {
  if (action.type === "login") {
    return { ...state, user: action.payload };
  }
  if (action.type === "logout") {
    return { ...state, user: undefined };
  }
  return state;
};

export const isLoggedIn = (state: AuthStore): boolean => !!state.user;
