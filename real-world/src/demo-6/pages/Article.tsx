import { FC } from "react";
import { useArticles } from "../../demo-3-3/useArticles";
import { useParams } from "react-router";

export const ArticlePage: FC = () => {
  const { articleList } = useArticles();
  const { slug } = useParams();
  const article = articleList.find((a) => a.slug === slug);
  return <div>{JSON.stringify(article, null, 2)}</div>;
};
