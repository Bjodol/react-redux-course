export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
};

export type Author = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export type User = {
  email: string;
  username: string;
  bio: string;
  image: string;
  token: string;
};
