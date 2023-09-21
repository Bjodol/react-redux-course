import { FC, ReactNode, createContext, useReducer } from "react";
import { User } from "./auth";
import { authReducer, isLoggedIn } from "./auth-reducer";

export type AuthContexType = {
  isLoggedIn: boolean;
  user?: User;
  setLogin: (user: User) => void;
};

export const AuthContext = createContext<AuthContexType>({
  isLoggedIn: false,
  setLogin: () => {},
});

export const AuthContexProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const [state, setState] = useState<Omit<AuthContexType, "setLogin">>({
  //   isLoggedIn: false,
  // });

  const [auth, dispatch] = useReducer(authReducer, {});

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn(auth),
        user: auth.user,
        setLogin: (user: User) => {
          // setState((prev) => {
          //   return { ...prev, user: user, isLoggedIn: true };
          // });
          dispatch({ type: "login", payload: user });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
