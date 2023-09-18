import { useState } from "react";
import "./App.css";
import { articles } from "./articles";
import { ArticlePreview } from "./demo-3-1/ArticlePreview";
import { MyForm } from "./demo-3-2/form";
import { MyInputField } from "./demo-3-2/input";
import { LightSwitch } from "./demo-3-2/on-off";
import { LightSwitchToggle } from "./demo-3-2/toggle";

function App() {
  const [articleList, setArticleList] = useState(articles);

  const onFavorite = (title: string) => {
    setArticleList((prevArticleList) => {
      return prevArticleList.map((article) => {
        if (article.title === title) {
          return {
            ...article,
            favorited: !article.favorited,
          };
        } else {
          return article;
        }
      });
    });
  };

  return (
    <div>
      {articleList.map((article) => {
        return (
          <div key={article.slug}>
            <ArticlePreview {...article} />
            <button onClick={() => onFavorite(article.title)}>
              {article.favorited ? "Favorited" : "Not favorited"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
