import { FC, useState } from "react";

export const LightSwitch: FC = () => {
  const [state, setState] = useState<boolean>(false);
  const label = state ? "on" : "off";
  return (
    <div>
      <p>{`The light switch is ${label}`}</p>
      <button
        onClick={() => {
          setState(false);
        }}
      >
        Off
      </button>
      <button
        onClick={() => {
          setState(true);
        }}
      >
        On
      </button>
    </div>
  );
};
