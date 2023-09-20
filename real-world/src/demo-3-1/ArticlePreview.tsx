import { FC, useContext } from "react";
import { Article } from "../types";
import { AuthorPreview } from "./AuthorPreview";
import { Link } from "react-router-dom";
import { AuthContext } from "../demo-6/auth-context";

type Props = Pick<Article, "title" | "description" | "slug" | "author">;
export const ArticlePreview: FC<Props> = ({
  author,
  description,
  slug,
  title,
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Link to={`/article/${slug}`}>
      <h2>{title}</h2>
      <p>{description}</p>
      <AuthorPreview {...author} />
      <button disabled={!isLoggedIn}>Favorite</button>
    </Link>
  );
};
