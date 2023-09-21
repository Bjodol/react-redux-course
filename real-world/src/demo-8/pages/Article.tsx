import { FC } from "react";
import { useArticles } from "../../demo-3-3/useArticles";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Article } from "../../types";
import { queryClient } from "../App";

type ArticleAPI = {
  article: Article;
};

export const getArticle = async (slug: string) => {
  const response = await fetch(`https://api.realworld.io/api/articles/${slug}`);
  const data: ArticleAPI = await response.json();
  return data.article;
};

export const ArticlePage: FC = () => {
  // const { articleList } = useArticles();
  const { slug } = useParams();
  const navigate = useNavigate();
  // const article = articleList.find((a) => a.slug === slug);

  const { data, isLoading, error } = useQuery<Article>({
    queryKey: ["articles", slug],
    queryFn: async () => {
      const article = await getArticle(slug ?? "");
      return article;
    },
    initialData: () => {
      const articles = queryClient.getQueryData<Article[]>(["articles", ""]);
      if (articles) {
        const article = articles.find((a) => a.slug === slug);
        return article;
      }
    },
  });

  return (
    <div>
      <button onClick={() => navigate("/")}>Go back</button>
      {JSON.stringify(data, null, 2)}
    </div>
  );
};
