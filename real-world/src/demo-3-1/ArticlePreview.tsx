import { FC } from "react";
import { Article } from "../types";
import { AuthorPreview } from "./AuthorPreview";
import { FavoriteButton, FavoriteButtonAlt } from "./FavoriteButton";

export const ArticlePreview: FC<
  Pick<Article, "title" | "description" | "slug" | "author">
> = ({ author, description, slug, title }) => {
  return (
    <a href={`/${slug}`}>
      <h2>{title}</h2>
      <p>{description}</p>
      <AuthorPreview {...author} />
      <FavoriteButton label="Favorite" onClick={() => alert("clicked")} />
      <FavoriteButtonAlt onClick={() => alert("clicked")}>
        Favorite
      </FavoriteButtonAlt>
    </a>
  );
};
