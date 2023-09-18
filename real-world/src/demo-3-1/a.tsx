import { Article } from "../types";

const article = {
  slug: "article-1",
  title: "This is the title of the first article",
  description:
    "This is an article description that summarizes the article body.",
  body: "This is the article body containig the entire article text. The article text is longer that the descripton.",
  tagList: ["Tag 1", "Tag 2"],
  createdAt: "2023-06-26T06:06:10.816Z",
  updatedAt: "2023-06-26T06:06:10.816Z",
  favorited: false,
  favoritesCount: 124,
  author: {
    username: "coolBanana",
    bio: "Likes apples",
    image: "image",
    following: false,
  },
};

export const { title, description, ...rest } = article;

type FavoriteArticle = {
  isFavorite: boolean;
} & Article;

export const favoriteArticle: FavoriteArticle = {
  isFavorite: true,
  ...article,
};
