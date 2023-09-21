import { FC, useEffect, useState } from "react";
import { Article } from "../../types";
import { ArticlePreview } from "../../demo-3-1/ArticlePreview";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useLoggedIn } from "../use-is-logged-in";

type ArticleAPI = {
  articles: Article[];
  articleCount: number;
};

export const getArticles = async (tag: string) => {
  const response = await fetch(
    tag
      ? `https://api.realworld.io/api/articles?tag=${tag}`
      : "https://api.realworld.io/api/articles"
  );
  const data: ArticleAPI = await response.json();
  return data.articles;
};

export const Home: FC = () => {
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [tag, setTag] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.auth);
  useLoggedIn();

  useEffect(() => {
    const loadArticles = async () => {
      const articles = await getArticles(tag);
      setArticleList(articles);
    };
    loadArticles();
  }, [tag]);

  return (
    <div>
      {user && <img src={user?.image} />}
      <button
        onClick={() => {
          setTag("rerum");
        }}
      >
        Rerum
      </button>
      <button
        onClick={() => {
          setTag("");
        }}
      >
        No tag
      </button>
      {articleList.map((article) => {
        return <ArticlePreview {...article} key={article.slug} />;
      })}
    </div>
  );
};
