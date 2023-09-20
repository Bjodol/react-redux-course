import { FC, ReactNode, createContext, useState } from "react";
import { User } from "./auth";

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
  const [state, setState] = useState<Omit<AuthContexType, "setLogin">>({
    isLoggedIn: false,
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        setLogin: (user: User) => {
          setState((prev) => {
            return { ...prev, user: user, isLoggedIn: true };
          });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
