import { FC } from "react";
import { Author } from "../types";

export const AuthorPreview: FC<Author> = ({
  bio,
  following,
  image,
  username,
}) => {
  return (
    <div>
      <h3>{username}</h3>
      <p>{bio}</p>
      <img src={image} />
      <p>{following}</p>
    </div>
  );
};
