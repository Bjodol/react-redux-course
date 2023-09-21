import { FC, useState } from "react";
import { login as fetchLogin } from "../auth";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedIn, login } from "../auth-slice";
import { useLoggedIn } from "../use-is-logged-in";

export const LoginPage: FC = () => {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  // const { setLogin } = useContext(AuthContext);
  const dispatch = useDispatch();
  const isLogged = useSelector(isLoggedIn);

  useLoggedIn();

  return (
    <div>
      <h1>Login</h1>
      {isLogged && <>User is logged in!</>}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const user = await fetchLogin(form.password, form.email);
          window.localStorage.setItem("user", JSON.stringify(user));
          dispatch(login(user));
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
