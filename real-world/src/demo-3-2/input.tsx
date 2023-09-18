import { FC, useState } from "react";

export const MyInputField: FC = () => {
  const [email, setEmail] = useState<string>("");

  return (
    <div>
      <label>Email</label>
      <input
        name="email"
        type="text"
        value={email}
        onChange={(event) => {
          console.log(event.target.value);
          setEmail(event.target.value);
        }}
      />
    </div>
  );
};
