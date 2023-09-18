import "./App.css";
import { articles } from "./articles";
import { MyReactShortHandComponent } from "./demo-3-1/b";

function App() {
  const article = articles[0];
  return (
    <MyReactShortHandComponent article={article} text="Cake" isLight={true} />
  );
}

export default App;
