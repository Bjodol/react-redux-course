# Redux - Global state management

## Purpose

Set up Redux, move the existing state to Redux, and implement the necessary reducers, actions, and selectors. By moving the state to Redux, we ensure that the state is preserved when changing routes and that the page remembers whether an article has been liked or not.

Illustration sources:

- [What is Redux? Store, Actions, and Reducers Explained for Beginners](https://www.freecodecamp.org/news/what-is-redux-store-actions-reducers-explained/)

---

## Tasks

### 1. Install necessary packages

Import [`redux`](https://redux.js.org/) and [`redux-toolkit`](https://redux-toolkit.js.org/):

```
npm i @reduxjs/toolkit react-redux
```

Redux-toolkit helps to simplify some of the more complex aspects of working with redux.

### 2. Configure redux store

Setup `redux` - create `store.ts` and add configuration (optionally place it within a folder - called state). Define your redux store and the initial state and reducers for your application.

> **Global state management throguht redux store**
> The `store` is responsible for holding the application state and providing methods to interact with that state. It follows the principles of a single source of truth and a predictable state container.
> Key concepts:
>
> - _Store:_ The store is like a container that holds the application's data (state).
> - _State:_ The state represents the data that describes the current condition of the application.
> - _Action:_ An action is a plain JavaScript object that describes an intention to change the state. It typically has a type property and may carry additional data (payload).
> - _Reducer:_ A reducer is a function that takes the current state and an action as input and produces a new state based on the action's type. It describes how the state should be updated.
> - _Dispatch:_ Dispatching an action means sending the action to the store. It triggers the execution of the reducers, resulting in a new state.

Use the `configureStore` function from redux-toolkit to create your store.

```jsx
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";

const store = configureStore({
  reducer: {
    // Todo fill in after creating the slice and insert its reducer here,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
```

Move into `App` and wrap everything there in the Redux `Provider`.

```jsx
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Article from "./pages/Article/Article";
import Home from "./pages/Home/Home";
import store from "./state/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
```

### 3. Create Actions and Reducers - createSlice

Now lets move the state data necessary to elevate to a global level into a slice:

> In Redux Toolkit, a slice is a concept that refers to a specific portion of the Redux store. It combines the definition of the reducer function, action creators, and initial state for a particular feature or domain of your application into a single logical unit.

Since our application is fairly small this is probably not necessary to do. But to accomodate for scalability and to show how one could scale such a store we choose to mak use of this separation of concerns.

- _Redux Toolkit provides utilities like [`createSlice`](https://redux-toolkit.js.org/api/createslice) to simplify this process of defining a slice. Provide a name, initialState and create reducers for updating state values._

An empty slice configuration looks like this:

```jsx
import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {},
  reducers: {},
});

export default appSlice.reducer;
```

Where the final export here can be imported into the `store.ts` file:

```jsx
const store = configureStore({
  reducer: {
    app: appReducer,
  },
});
```

Now lets fill inn our slice with the application logic needed to enable shared state across our two pages.

- Together with the participants identify how the initialState should look, what state values are needed for the basic logic of keeping the articles updated.
- Set the inital state once the store structure is defined.
- Next step, how should the identified state be updated, what oogic is needed to update the state values? Create reducers where necessary to conficgure the state updating logic.
- Export reducers so they can be used in the files when needed to update the states. (_works as setters, to update the states. Can only contain logic or accept props that can be used in computation of the new value of simply set the new value by updating the entire object or only certain attributes of the stored object._)
- Create selectors for the state values to make them easily accessbile where needed. (_works as getters, allows you to get the current state value from the store. This could be done in the respective files but to avoid repeating code its is considered better to store them here to keep the logic in one location_)

<details>
<summary> Suggestion 💡</summary>

```jsx
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { articles } from "../articles";
import { Article } from "../types";
import { RootState } from "./store";

interface AppState {
  articles: Article[];
  selectedArticleSlug: string | null;
}

const initialState: AppState = {
  articles: articles,
  selectedArticleSlug: null,
};

const slugToArticle = (articles: Article[], slug: string) => {
  return articles.find((article) => article.slug === slug);
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loadArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    loadArticle: (state, action: PayloadAction<string>) => {
      state.selectedArticleSlug = action.payload;
    },
    submitFavorite: (state, action: PayloadAction<string>) => {
      const article = slugToArticle(state.articles, action.payload);

      if (article) {
        article.favorited = !article.favorited;
        article.favoritesCount = article.favorited
          ? article.favoritesCount + 1
          : article.favoritesCount - 1;
      }
    },
  },
});

export const selectArticles = (state: RootState) => state.app.articles;
export const selectArticle = (state: RootState) => {
  if (state.app.selectedArticleSlug) {
    return slugToArticle(state.app.articles, state.app.selectedArticleSlug);
  }
};

export const { loadArticles, loadArticle, submitFavorite } = appSlice.actions;

export default appSlice.reducer;
```

We have structured the state so that is stores all the articles, and the slug of the selected article.

We have also defined three reducers:

- The first one, `loadArticles` takes an article list as payload, and simply updates the state.
- The second, `loadArticle` takes an article slug, and sets it as the `selectedArticleSlug`. This is intended to be used when the user clickes on an article.
- The third one is `submitFavorite`. It also takes a slug as payload. It then has to find the correct article in the article array, and updates it's properties.

These will be used through the dispatch object accessibe from the `useDispatch` hook.

To access the data in the store we have exported two selectors: -`selectArticles` and `selecArticle`.

They are meant to be used with the `useSelector()`-hook to retrieve data in a component. While it is not neccesary to define the selectors in the slice file we believe it is good practice to have the logic for updating and reading the store at the same place. You can read more about how to use selectors [here](https://redux.js.org/usage/deriving-data-selectors).

</details>

### 4. Connect components to Redux state

Now that the store is seutp and ready to be used lets access and update states through store instead of local state.

> Access Redux store values from functional component.
> Redux provides different hooks to retieve and update stored state values - `useSelector`, `useDispatch` and `useStore` - we will use the first two.

- Use the `useSelector` hook from `react-redux` to access the state from your components.
- Use the `useDispatch` hook from `react-redux` to dispatch actions from your components.

#### Suggestion:

<details>
<summary> Home.tsx 💡</summary>

- Remove the articleList state.
- Get selectedArticles form the store.
- Add a useEffect to update the articles in store on initial load.
- Remove the handleFavorite function.

```jsx
import { useSelector } from "react-redux";
import { selectArticles } from "../../state/appSlice";
import ArticlePreview from "./../../components/ArticlePreview/ArticlePreview";
import Header from "./../../components/Header/Header";
import "./Home.css";

const Home = () => {
  const articleList = useSelector(selectArticles);
  return (
    <>
      <Header />
      <main className="content">
        {articleList.map((article) => (
          <ArticlePreview key={article.slug} article={article} />
        ))}
      </main>
    </>
  );
};

export default Home;
```

</details>

<details>
<summary> Article.tsx 💡</summary>

- Remove article-state.
- Retrieve article from store using the selectArticle-selector.
- Set the updated store value using dispatch - loadArticles and loadArticle reducers.
- Remove the state and useLocation hook, replace it with the useParams hook to retrieve the slug form the url.

```jsx
const dispatch = useDispatch();
const article = useSelector(selectArticle);
const { slug } = useParams();
const [loading, setLoading] = useState<boolean>(false);
...
useEffect(() => {
    if (!article) {
        setLoading(true);
        try {
        const fetchedArticle = articles.find(
            (article) => article.slug === slug
        ) as Article;
        dispatch(loadArticle(fetchedArticle.slug));
        } catch (error) {
        console.error("Error fetching article:", error);
        } finally {
        setLoading(false);
        }
    }
}, [article]);
```

</details>

<details>
<summary> ArticlePreview.tsx 💡</summary>

- Remove handleFavorite from Props.
- Since we need onClick to update state and navigate, we should not use the Link - replace Link with button.
- Create onClick - handle function that will dispatch the new selected article and navigate to the article url.
  - Now we need to set state here before navigation since the article page now relies on state through redux instead of react-router.

```jsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadArticle } from "../../state/appSlice";
import { Article } from "../../types";
import ArticleMeta from "../ArticleMeta/ArticleMeta";
import TagList from "../TagList/TagList";
import "./ArticlePreview.css";

interface Props {
  article: Article;
}

const ArticlePreview = ({ article }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNavigate = () => {
    dispatch(loadArticle(article.slug));
    navigate(`/article/${article.slug}`);
  };
  return (
    <div className="article-preview">
      <ArticleMeta article={article} />
      <button onClick={handleNavigate} className="article-link">
        <h1>{article.title}</h1>
        <p className="description">{article.description}</p>
        <span className="subtitle1">Read more...</span>
        <TagList article={article} />
      </button>
    </div>
  );
};

export default ArticlePreview;
```

</details>

<details>
<summary> ArticleMeta.tsx 💡</summary>

- Remove handleFavorite from Props.
- Use dispatch and submitFavorite reducer to update favorite.

```jsx
import { useDispatch } from "react-redux";
import { submitFavorite } from "../../state/appSlice";
import { Article } from "../../types";
import "./ArticleMeta.css";

interface Props {
  article: Article;
}
const ArticleMeta = ({ article }: Props) => {
  const dispatch = useDispatch();

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
        onClick={() => {
          dispatch(submitFavorite(article.slug));
        }}
      >
        Like {article.favoritesCount}
      </button>
    </div>
  );
};

export default ArticleMeta;
```

</details>

Now the state persists to some degree, i.e. you can navigate from home-page into articles and back by using the home-button or back-button. When you reload the page, the Redux store is reinitialized, and the state is reset to its initial values (our static articles data).

Next step will therefore be to introduce a backend that can store and handle the data states.
