import { FC, useState } from "react";
import { login } from "../auth";

export const LoginPage: FC = () => {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const user = await login(form.password, form.email);
          window.localStorage.setItem("user", JSON.stringify(user));
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
