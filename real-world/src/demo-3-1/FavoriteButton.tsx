import { FC } from "react";

type FavoriteButtonProps = {
  onClick: () => void;
  label: string;
};

export const FavoriteButton: FC<FavoriteButtonProps> = ({ onClick, label }) => {
  return <button onClick={() => onClick()}>{label}</button>;
};

export const FavoriteButtonAlt: FC<JSX.IntrinsicElements["button"]> = ({
  children,
  ...rest
}) => {
  return <button {...rest}>{children}</button>;
};
