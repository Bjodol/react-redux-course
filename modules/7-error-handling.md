# Error handling & Pagination

## Goal

Focus on error handling and pagination. The aim is to improve user experience by implementing error pages for `404 not found` errors and adding loading indicators during data fetching. Pagination is introduced to split and display large sets of data, allowing users to navigate through the data one page at a time. The React Router structure is restructured to introduce sub-routes, allowing for a global root layout that includes the header component. Overall, the focus is on enhancing the user experience through proper error handling and smoother data pagination.

---

## Tasks

### 1. Restructure React-router - Introduce sub-routes

Currently the header component is added on a per page basis, which could be avoided by utiligzing the Root and sub-routes structure from react-router.

Let's make use of the subroute struture:

- Add a `Route` element around all existing routes - Assing this route the `"/"` path and a `Root`-element that will be created next.
- Create the `Root`-layout - (location in src or layout folder?)

  - Here we use the `Outlet` element from `react-router-dom` that indicates where in the Root layout the sub-route elements should be inserted.
  - Read more about `Nested routes` [here](https://reactrouter.com/en/main/start/tutorial#nested-routes).

- Replace the path in the `Home`-router with `index` boolean value to indicate that this route will be the default of the subroutes.
- Remove the fragment-element and `Header` component from your pages.

<details>
<summary> Suggestion 💡</summary>

**App.tsx**

```jsx
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Root from "./Root";
import Article from "./pages/Article/Article";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import store from "./state/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
```

**Root.tsx**

```jsx
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";

const Root = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
export default Root;
```

</details>

### 2. Error page

The application is currently only console logging the errors that may occurr. Such as when a user fails to login or any fetch call to the API fails. To improve user experience and overall application error-handling we can add a few improvements to our setup:

- Create an `Error`-page - for 404 not found requests
- Add default path with error page as element as a route
- Use the `Error`-page in case the article slug is erroneous

<details>
<summary> Suggestion 💡</summary>

**Error.tsx**

```jsx
import { Link } from "react-router-dom";
import "./Error.css";

const Error = () => {
  return (
    <div className="error">
      <h1>404 - Page Not Found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/" className="home-link">
        Return to Home Page
      </Link>
    </div>
  );
};

export default Error;
```

**Error.css**

```jsx
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.error h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error p {
  margin-bottom: 1rem;
}

.error .home-link {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #5cb85c;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}

.error .home-link:hover {
  background-color: #5cb85c;
}

```

**App.tsx**

```jsx
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Root from "./Root";
import Article from "./pages/Article/Article";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import store from "./state/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
```

**Article.tsx**

```jsx
if (loading) {
  return <div>Loading...</div>;
}
if (!article) {
  return <Error />;
}
```

</details>

### 2.a Login error

Another missing `Error` that we have not considered is the case where the user enters the wrong password. Have you tried this yet? There are no visible changes on the page that tell you why your login attempt did not succeed. Let's do something about that. We can make use of the `useState`-hook again and set an error message that provides the user with feedback.

- Add new state for the error
- Set the error state in the catch part of the submit handling.
- Insert a conditional element that displays the error if it exists

<details>
<summary> Suggestion 💡</summary>

**Login.tsx**

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./../../api/axios";
import "./Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate(-1);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-header">Sign in</h1>
      <div>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-container">
        <button type="submit">Sign in</button>
      </div>
    </form>
  );
};

export default LoginPage;
```

**Login.css**

```css
.error-message {
  color: red;
}
```

</details>

### 3. Add Pagination

Currently our application only shows the first 20 articles available from the backend. As this is the default size fethced in each call. To avoid fetching a large amounts of data in one load, most of which might never become used, we want to indtrouce `pagination`.

> **Pagination** refers to splitting and displaying large sets of data into manageable chunks or pages, allowing users to navigate through the data one page at a time.

This feature will require three changes:

- Update the Articles fetcher in axios - make use of the params that the `/articles` endpoint accepts.
- Update the ArticlesResponse type to include the count. See [response structure](https://www.realworld.how/docs/specs/backend-specs/api-response-format#multiple-articles).
- Add `pageCount` to Redux state - calculated using articlesCount and page size, add a selector to access it
- Update loadArticles in `Article.tsx` to use this new format
- Update `Home.tsx` to show a pagination element in the bottom
- Add `currentPage` state to Redux setup with reducer and selecter - use this in the pagination component to style the current page element specifically.
- (optional) Move the pagination element into its own file - Let is be its own component.

<details>
<summary> Suggestion 💡</summary>

**axios.ts**

```jsx
interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}
...
export const fetchArticles = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const res =
    (await api.get) <
    ArticlesResponse >
    ("/articles",
    {
      params: { offset, limit },
    });
  return res.data;
};
```

**appSlice.ts**

```jsx
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ArticlesResponse } from "../api/axios";
import { Article, User } from "../types";
import { RootState } from "./store";

interface AppState {
  articles: Article[];
  selectedArticleSlug: string | null;
  user: User | null;
  pageCount: number;
  currentPage: number;
}

const initialState: AppState = {
  articles: [],
  selectedArticleSlug: null,
  user: null,
  pageCount: 1,
  currentPage: 1,
};

const slugToArticle = (articles: Article[], slug: string) => {
  return articles.find((article) => article.slug === slug);
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loadArticles: (state, action: PayloadAction<ArticlesResponse>) => {
      state.articles = action.payload.articles;
      state.pageCount = Math.ceil(action.payload.articlesCount / 10);
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
    signin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    signout: (state) => {
      state.user = null;
      state.articles = [];
      state.selectedArticleSlug = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const selectArticles = (state: RootState) => state.app.articles;
export const selectArticle = (state: RootState) => {
  if (state.app.selectedArticleSlug) {
    return slugToArticle(state.app.articles, state.app.selectedArticleSlug);
  }
};
export const selectUser = (state: RootState) => state.app.user;
export const selectPageCount = (state: RootState) => state.app.pageCount;
export const selectCurrentPage = (state: RootState) => state.app.currentPage;

export const {
  loadArticles,
  loadArticle,
  submitFavorite,
  signin,
  signout,
  setCurrentPage,
} = appSlice.actions;

export default appSlice.reducer;
```

**Article.tsx**

```jsx
...
try {
    const article = await fetchArticleBySlug(slug);
    dispatch(loadArticles({ articles: [article], articlesCount: 1 }));
    dispatch(loadArticle(article.slug));
} catch (error) {
} finally {
    setLoading(false);
}
...
```

**Home.tsx**

```jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../api/axios";
import {
  loadArticles,
  selectArticles,
  selectCurrentPage,
  selectPageCount,
  selectUser,
  setCurrentPage,
} from "../../state/appSlice";
import ArticlePreview from "./../../components/ArticlePreview/ArticlePreview";
import "./Home.css";

const Home = () => {
  const articleList = useSelector(selectArticles);
  const pageCount = useSelector(selectPageCount);
  const user = useSelector(selectUser);
  const currentPage = useSelector(selectCurrentPage);

  const dispatch = useDispatch();

  const handlePageChange = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const articles = await fetchArticles(currentPage);
        dispatch(loadArticles(articles));
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetch();
  }, [dispatch, user, currentPage]);

  return (
    <main className="content">
      {articleList.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
      <ul className="pagination">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (pageNumber) => (
            <li
              key={pageNumber}
              className="page-item"
              onClick={() => handlePageChange(pageNumber)}
            >
              <button
                className={`page-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                {pageNumber}
              </button>
            </li>
          )
        )}
      </ul>
    </main>
  );
};

export default Home;
```

</details>

**API resources:** Here we set the default page number to be 1 and the pageSize (_called limit in the endpoint params_) to 10. Also, from the [endpoint docs](https://www.realworld.how/docs/specs/frontend-specs/swagger) you can see that the `/articles` endpoint returns an object of two values - `{articles: Article[], articlesCount: number}`. Until now we allowed out fetcher to only return the articles, but in order to calculate the number of pages (buttons) in the pagination component we need this total amount of articles available. So, alter the fetcher to return the whole object.

### 3.a (Optional) - Global constants file

As you may have noticed the pageSize value is now used and set in two locations:

- `appSlice.ts` - loadArticles reducer.
- `axios.ts` - fetchArticles pageSize-prop default value.

For easier maintenance and to prevent update inconsistencies this value could arguably be moved to a global constants file.

- Create `src/constants.ts` - holding pageSize value
- Update `appSlice.ts` and `axios.ts` to use this vlaue instead

<details>
<summary> Suggestion 💡</summary>

**constants.ts**

```jsx
export const PAGE_SIZE = 10;
```

**appSlice.ts**

```jsx
...
loadArticles: (state, action: PayloadAction<ArticlesResponse>) => {
      state.articles = action.payload.articles;
      state.pageCount = Math.ceil(action.payload.articlesCount / PAGE_SIZE);
    },
...
```

**axios.ts**

```jsx
...
export const fetchArticles = async (page = 1, limit = PAGE_SIZE) => {
  const offset = (page - 1) * limit;
  const res = await api.get<ArticlesResponse>("/articles", {
    params: { offset, limit },
  });
  return res.data;
};
...
```

</details>

### 4. (Optional) Improve Loading experience

As you probably see, the user recieve limited feedback about the fetching of next page of articles happening behind the scenes after page-click or refresh.

Let's add a `Loading`-component that can be displayed when fetching is happening to improve the user experience.

- Create a loading component and relevant css styling
- Add the component to relevant places

<details>
<summary> Suggestion 💡</summary>

**Loading.tsx**

```jsx
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading">
      <h1>Loading...</h1>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;
```

**Loading.css**

```jsx
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #5cb85c;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

**Home.tsx**

```jsx
...
const [loading, setLoading] = useState(false);
...
useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const articles = await fetchArticles(currentPage);
        dispatch(loadArticles(articles));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };
    fetch();
  }, [dispatch, user, currentPage]);

  if (loading) return <Loading />;
...
```

**Article.tsx**

```jsx
if (loading) {
  return <Loading />;
}
```

</details>
