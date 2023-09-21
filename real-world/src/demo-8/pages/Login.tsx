import { FC, useState } from "react";
import { LoginResponse, login as fetchLogin } from "../auth";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedIn, login } from "../auth-slice";
import { useLoggedIn } from "../use-is-logged-in";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../App";

export const LoginPage: FC = () => {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  // const { setLogin } = useContext(AuthContext);
  // const dispatch = useDispatch();
  // const isLogged = useSelector(isLoggedIn);

  // useLoggedIn();

  const { data, mutate, isError } = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const user = await fetchLogin(password, email);
      window.localStorage.setItem("user", JSON.stringify(user));
      return user;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["login"]);
      },
    }
  );

  if (isError) return <div>Error...</div>;
  return (
    <div>
      <h1>Login</h1>
      {data && <>User is logged in!</>}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          mutate({ email: form.email, password: form.password });
          // const user = await fetchLogin(form.password, form.email);
          // window.localStorage.setItem("user", JSON.stringify(user));
          // dispatch(login(user));
        }}
      >
        <label>Email</label>
        <input
          type="text"
          value={form.email}
          onChange={(event) => {
            setForm((prev) => {
              return {
                ...prev,
                email: event.target.value,
              };
            });
          }}
        />
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(event) => {
            setForm((prev) => {
              return {
                ...prev,
                password: event.target.value,
              };
            });
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
