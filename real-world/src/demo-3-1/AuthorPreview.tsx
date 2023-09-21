import { FC } from "react";
import { Author } from "../types";

export const AuthorPreview: FC<Author & { onClick: () => void }> = ({
  bio,
  following,
  image,
  username,
  onClick,
}) => {
  return (
    <div>
      <h3>{username}</h3>
      <p>{bio}</p>
      <img src={image} />
      <p>{following}</p>
      <button onClick={onClick}>Click</button>
    </div>
  );
};
