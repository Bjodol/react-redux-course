import { FC, useState } from "react";

export const LightSwitchToggle: FC = () => {
  const [state, setState] = useState<boolean>(false);
  return (
    <div>
      <p>{`The light switch is ${state}`}</p>
      <button
        onClick={() => {
          setState((prev) => {
            return !prev;
          });
        }}
      >
        Toggle
      </button>
    </div>
  );
};
