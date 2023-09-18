import "./App.css";
import { articles } from "./articles";
import { ArticlePreview } from "./demo-3-1/ArticlePreview";
import { MyReactShortHandComponent } from "./demo-3-1/b";

function App() {
  const article = articles[0];
  return <ArticlePreview {...article} />;
}

export default App;
