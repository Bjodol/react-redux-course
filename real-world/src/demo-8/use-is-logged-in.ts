import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./auth-slice";

export const useLoggedIn = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = window.localStorage.getItem("user" ?? "{}");
    if (user) {
      dispatch(login(JSON.parse(user)));
    }
  }, [dispatch]);
};
