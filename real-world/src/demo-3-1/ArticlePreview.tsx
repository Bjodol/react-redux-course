import { FC } from "react";
import { Article } from "../types";
import { AuthorPreview } from "./AuthorPreview";
import { FavoriteButton, FavoriteButtonAlt } from "./FavoriteButton";

type Props = Pick<Article, "title" | "description" | "slug" | "author">;
export const ArticlePreview: FC<Props> = ({
  author,
  description,
  slug,
  title,
}) => {
  return (
    <a href={`/${slug}`}>
      <h2>{title}</h2>
      <p>{description}</p>
      <AuthorPreview {...author} />
    </a>
  );
};
