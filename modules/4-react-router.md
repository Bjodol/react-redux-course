# Routing

## Purpose

Introduce routing using [_react-router_](https://reactrouter.com/en/main). You will learn how to navigate between pages, handle dynamic routes, and create a separate article page. The need for global state management will also be emphasized. This will in more concrete terms involve adding routing so the `ArticlePreview`-items are clickable. You will also need to create `Article`-page that displays the clicked on article object. This will lead to the introduction of a `pages`-folder to make a more scalable directory. Complete the module by empazising that now using routing the `like`-functionality no longer work - We need to introduce globl state management.

---

## Tasks

### 1. Install react-router-dom

Install [`react-router-dom`](https://reactrouter.com/en/main/start/tutorial#setup)

```
npm i react-router-dom
```

### 2. Move the current App implementaiton

It's generally recommended to locate the router configurations in the `App`-file, rather than `index/main`. `App`is usually the root component in React applicaitons.

The `index/main.ts` file is typically the entry point of your application, responsible for rendering the root component into the DOM. It's where you set up the basic configuration for your React app, such as importing necessary dependencies and rendering the root component.

On the other hand, the `App` component represents the main component of your application. It serves as a container for other components and defines the overall structure and layout of your app. Including the router elements within the App component allows you to manage routing and navigation within the context of your application's component hierarchy.

- Create a `pages` folder - `src/pages`
- Create a folder within that folder named Home that contains `Home.tsx` and `Home.css`.
- Move the code currently in `App.tsx` into `Home.tsx`.

### 2. Configure router and routes

Add react-router to `App.tsx`.

- Remove the articleList code now moved into `Home`.
- Start by adding the `BrowserRouter` wrapper - handles the routing by synchronizing the UI with the URL in the browser's address bar.
- Within that wrapper add the `Routes`-wrapper - acts as a container for your route definitions.

<details>
<summary> Suggestion 💡</summary>

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

</details>

### 3. Add navigation

Currently the application only displays the description - sort summary - of each article. We want wach `ArticlePreview` element to be clickable and route the users to an `Article`-page where the full article text will be displayed.

Lets make the article previews clickable and routable.

- Introduce the Link component from `react-router-dom`.
- Wrap the preview content - i.e. `title`, `description` and `tagList` in the `Link`-component.
- Specify the `pathname` in the `to`-prop and pass the `article`-object in `state`.
  - to: `/article/slug`.
  - state: article-object that was clicked.

<details>
<summary> Suggestion 💡</summary>

```jsx
// ArticlePreview.tsx
<Link to={`/article/${article.slug}`} state={article} className="article-link">
  <h1>{article.title}</h1>
  <p className="description">{article.description}</p>
  <span className="subtitle1">Read more...</span>
  <ul className="tag-list">
    {article.tagList.map((tag, index) => (
      <li key={`tag-${index}-${tag}`} className="tag">
        {tag}
      </li>
    ))}
  </ul>
</Link>
```

```css
.article-preview .article-link {
  text-decoration: none;
  color: inherit;
  background: white;
  text-align: start;
  border: none;
}

.article-preview .article-link:hover {
  cursor: pointer;
}
.article-preview .article-link .description {
  font-weight: 300;
  font-size: 1rem;
  color: #999;
  margin-bottom: 1rem;
  line-height: 1.3rem;
}

.article-preview .article-link h1 {
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}
```

Move into the `Header`-component, here you can now replace the `<a>`-element with this link as well:

```jsx
<header className="header">
  <nav className="navbar">
    <Link to="/">Home</Link>
  </nav>
</header>
```

</details>

### 4. Add Article route

Trying to clikc on the article now will not work, since we have yet to configure the `Route` for that url. Let's add that now:

- Add a new `Route` with the path `/article/:slug`. Where slug is the unique article identifier.

<details>
<summary> Suggestion 💡</summary>

```jsx
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<Article />} />
      </Routes>
    </BrowserRouter>
  );
};
```

</details>

Now your code complains since we have yet to create the article Page component.

### 5. Create the `Article`-page.

Create a new `Article` folder in the pages folder - holding the `Article.tsx` and `Article.css` files.

- Create an Article page similar to the structure from conduit.

<details>
<summary> Suggestion 💡</summary>

```jsx
import { useLocation } from "react-router-dom";
import { Article } from "../../types";
import { articles } from "../../articles";
import "./Article.css";

const ArticlePage = () => {
  const article: Article = articles[0];

  if (!article) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="article">
        <div className="header">
          <div className="header-content">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <div className="info">
                <a href="/">{article.author.username}</a>
                <span className="subtitle1">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button className={article.favorited ? "favorited" : ""}>
                Like {article.favoritesCount}
              </button>
            </div>
          </div>
        </div>
        <div className="content">
          <p className="text">{article.body}</p>
          <ul className="tag-list">
            {article.tagList.map((tag, index) => (
              <li key={`tag-${index}-${tag}`} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
```

```css
.article .article-header {
  background-color: black;
  color: white;
  padding: 0.625rem;
  text-align: start;
}

.article .article-header .header-content {
  max-width: 960px;
  margin: 0 auto;
}
```

</details>

### 5. Retrieve article if not available

If a user decides to go directly to the Article-specific page this state wil not be passed. Fix so we retrieve data from storage if not passed as state.

- Some users may want to bookmark one specific article-url or send it to someone - state will then not be provided on initial load.
- Get article object from `articles.ts` if not provided by state.
- Add `article` and `loading` states to handle "fetching" (_here on static data_).

<details>
<summary> Suggestion 💡</summary>

```jsx
const { slug } = useParams();
const [article, setArticle] = useState<Article | null>(null);
const [loading, setLoading] = useState<boolean>(false);

useEffect(() => {
   if (!article) {
     setLoading(true);
     try {
         const fetchedArticle = articles.find(
     (article) => article.slug === slug) as Article;
         setArticle(fetchedArticle);
     } catch (error) {
         console.error("Error fetching article:", error);
     } finally {
         setLoading(false);
     }
   }
}, [article]);

if (loading || !article) {
   return <div>Loading...</div>;
}
```

</details>

### 6. (Optional) Identify potential new reusable components and restructures.

Identify structures in the code that are now used multiple places - suggest moving these into their own components.

- The `ArticleMeta`-div is needed now in both `ArticlePreview` and `Article` - create an article meta component to make it reusable.
- The `TagList`-ul is also needed in both, this could also be moved to its own cmponent.
- Replace code in `ArticlePreview` and `Article` to make use of these if deciding to create two new components.

#### Suggestion:

<details>
<summary>Article meta 💡</summary>

```jsx
import { Article } from "../../types";

interface Props {
  article: Article;
  handleFavorite?: () => void;
}
const ArticleMeta = ({ article, handleFavorite }: Props) => {
  return (
    <div className="article-meta">
      <div className="info">
        <a href="/">{article.author.username}</a>
        <span className="subtitle1">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      <button
        className={article.favorited ? "favorited" : ""}
        onClick={handleFavorite}
      >
        Like {article.favoritesCount}
      </button>
    </div>
  );
};
export default ArticleMeta;
```

Move styling from `ArticlePreview.css`:

```css
.article-meta {
  display: flex;
  justify-content: space-between;
}

.article-meta .info {
  display: inline-block;
}

.article-meta button {
  color: #5cb85c;
  background-color: transparent;
  border: 1px solid #5cb85c;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.article-meta button.favorited {
  background-color: #5cb85c;
  border-color: #3d8b3d;
  color: #fff;
}

.article-meta button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.article-meta button:hover {
  background: #5cb85c;
  color: white;
}
.article-meta button.favorited:hover {
  background: #3d8b3d;
}
```

Remember to now pass the handle function down from ArticlePreview into meta.

</details>

<details>
<summary>Tag list 💡</summary>

```jsx
import { Article } from "../../types";
import "./TagList.css";
interface Props {
  article: Article;
}
const TagList = ({ article }: Props) => {
  return (
    <ul className="tag-list">
      {article.tagList.map((tag, index) => (
        <li key={`tag-${index}-${tag}`} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
};
export default TagList;
```

```css
.tag-list {
  display: flex;
  gap: 8px;
  margin: 0;
  justify-content: end;
  list-style: none;
}

.tag-list .tag {
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  border: 1px solid #ddd;
  border-radius: 16px;
  color: #aaa;
  padding: 4px 8px;
}
```

</details>

Note that moving the ArticleMeta elements into it's own component - meaning passing the `handleFavorite` function one more level down the component-tree leads to the Article-page complaining since there is no handle function in that component.

Adding local state here will not solve our issues - adding a lot of code here to fetch the static data and update the state locally will be a messy way to try to sync up our pages states. This motivates the need for introducing and adding global state to the application.

For now to stop it from complaining you can set the handleFavorite prop in ArticleMeta and ArticlePreview to optional using the `?` indicator, and see that the complain vanishes.
