export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
};
type LoginResponse = {
  user: User;
};

export const login = async (password: string, email: string) => {
  const response = await fetch("https://api.realworld.io/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { password, email } }),
  });
  const data: LoginResponse = await response.json();
  return data.user;
};

export const getUser = async () => {
  const token = JSON.parse(window.localStorage.getItem("user") ?? "{}").token;
  const response = await fetch("https://api.realworld.io/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data: LoginResponse = await response.json();
  return data.user;
};
