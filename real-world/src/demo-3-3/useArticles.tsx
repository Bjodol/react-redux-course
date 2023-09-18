import { FC, useEffect, useState } from "react";
import { Article } from "../types";
import { getArticles } from "./ArticleList";
import { ArticlePreview } from "../demo-3-1/ArticlePreview";

export const useArticles = () => {
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [tag, setTag] = useState<string>("");

  useEffect(() => {
    const loadArticles = async () => {
      const articles = await getArticles(tag);
      setArticleList(articles);
    };
    loadArticles();
  }, [tag]);

  return {
    articleList,
    setTag,
  };
};

export const MyApp: FC = () => {
  const { setTag, articleList } = useArticles();
  return (
    <div>
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
