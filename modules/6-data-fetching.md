# Data fetching

## Purpose

Add backend communication to our application by fetching articles from the Realworld.how API. We will learn the principles of making asynchronous API calls using async and await syntax and utilize the useEffect hook to perform these calls. We will also introduce the axios library as a tool to perform HTTP requests to external APIs.

---

## Tasks

So far in the application, we have dealt with dummy data that has been locally stored - the `articles.ts` file. The next step is to instead fetch our data from **Realworld.how's API**. The endpoint we will use to fetch articles is served here https://api.realworld.io/api/articles. (NB: Since the previous part of the course will involve creating their own backend his will not be the case in the actual course - but on creating the setup we will use this endpoint.)

> To see all endpoints available, take a look at them [here](https://www.realworld.how/docs/specs/backend-specs/endpoints).

**Async calls ⏳**: When we introduce data sources from external sources, we are introducing `async` function calls. When we call external APIs (i.e. applications running on another server than the frontend project, like realworld.how), it often means that the response will not be ready immediately as the code is running. The way code knows to "wait" for response, is by calling them `async`. Any async code has to be wrapped in async code up to the "highest level", which is an important thing to remember to really understand how to call and use async calls.

> **Code compiling and non-async calls 💡**: Code compiles line by line and is non-async by default. If a call is sent out and takes some time to respond, non-async code lines will jump straight to the next line with "empty"/missing response from external APIs.

**Axios**: To call an external API, you can either do it with `fetch` or `axios` - up to you! Axios is the most used method, as it is more modern than the fetch method - and has extra features that can help handle your API calls easier.

### 1. Install necessary packages

Axios needs to be installed, as it is not integrated in React already like fetch is:

```
npm install axios
```

### 2. Replace dummy data with API data.

To implement the realworld.how data, go to the place in your code that uses the current dummy data from `articles.ts`. In our example, this is currently set in our Redux store initial value.

- In `appSlice` remove the articles import and replace the initial articles value to be an empty array.
- Move the initializing logic to `Home.tsx` - Using useEffect and async/awit function calls with `axios.get`.
- Do the same for `Article.tsx` to re-fetch on page reload.

<details>
<summary> Suggestion 💡</summary>

**Home.tsx**

```jsx
useEffect(() => {
  const fetch = async () => {
    try {
      const response = await axios.get("https://api.realworld.io/api/articles");
      dispatch(loadArticles(response.data.articles));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  fetch();
}, [dispatch]);
```

**Article.tsx**

```jsx
useEffect(() => {
  const fetch = async () => {
    if (!article) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );
        dispatch(loadArticles([response.data.article]));
        dispatch(loadArticle(response.data.article.slug));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  fetch();
}, [article]);
```

</details>

Since the loadArticle - rely on getting an article from the articles array in store - we need to update this array as well to enable refresh of article-pages. By adding `dispatch(loadArticles([response.data.article]))` we update both the array and the selected article in our store.

Now, the articles can be fetched by using more fetchData functions using our configured axios instance - `axios.get('INSERT_API_ENDPOINT_HERE😊')`, with async/await calls.

Async function calls inside useEffect - Here we define an async function within the useEfect that we call after defining it. This is recommended syntax for this common scenario. When making asynchronous calls in React using useEffect, it's recommended to wrap the async call in a separate function inside useEffect rather than calling it directly. This approach helps prevent infinite loops and keeps code organized. By separating the async call, you can easily specify dependencies for the effect, ensuring it runs only when necessary. Additionally, it allows for cancellation or cleanup of the async call when the component unmounts.

### 3. Create an api folder.

For scalability and easier maintenance it is smart to move the api logic in its own file. For instance if the endpoint urls now were to change this would require changes to both page-files.

- Create `src/api/axios.ts` - location for our endpoint logic
- Move the endpoint logic just added into this file.
  - (Now the files complain about type)
- Define response types to the api calls.
- Update the async-awiat in Home and Article to use these new api fetch calls.
- Optional - `axios.ts` file cleanup, use axios.create to create an api instance setting the baseurl.

<details>
<summary> Suggestion 💡</summary>

**axios.ts (version 1 - before cleanup)**

```jsx
import axios from "axios";
import { Article } from "../types";

interface ArticlesResponse {
  articles: Article[];
}

interface ArticleResponse {
  article: Article;
}
export const fetchArticles = async () => {
  const response =
    (await axios.get) <
    ArticlesResponse >
    "https://api.realworld.io/api/articles";
  return response.data.articles;
};
export const fetchArticleBySlug = async (slug: string) => {
  const response =
    (await axios.get) <
    ArticleResponse >
    `https://api.realworld.io/api/articles/${slug}`;
  return response.data.article;
};
```

**Home.tsx**

```jsx
useEffect(() => {
  const fetch = async () => {
    if (!article && slug) {
      setLoading(true);
      try {
        const article = await fetchArticleBySlug(slug);
        dispatch(loadArticles([article]));
        dispatch(loadArticle(article.slug));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  fetch();
}, [article]);
```

**Article.tsx**

```jsx
useEffect(() => {
  const fetch = async () => {
    try {
      const articles = await fetchArticles();
      dispatch(loadArticles(articles));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  fetch();
}, [dispatch]);
```

**axios.ts (version 2 - after cleanup)**

This code can be even more simplified. Let's move the baseUrl for itself since the "https://api.realworld.io/api" is then not needed to be updated in more than one location. We do this by making use of the `create` function in `axios` - that let's us creata a custom axios instance with custom configurations, i.e. custom baseURL.

Instead of `axios.get` we can now write `api.get` and drop the baseURL part of the api endpoint-url.

```jsx
import axios from "axios";
import { Article } from "../types";

interface ArticlesResponse {
  articles: Article[];
}

interface ArticleResponse {
  article: Article;
}
const api = axios.create({
  baseURL: "https://api.realworld.io/api",
});

export const fetchArticles = async () => {
  const response = (await api.get) < ArticlesResponse > "/articles";
  return response.data.articles;
};
export const fetchArticleBySlug = async (slug: string) => {
  const response = (await api.get) < ArticleResponse > `/articles/${slug}`;
  return response.data.article;
};
```

To ensure type-safety we should also add the types that the responses from the endpoint follow. This can be seen in the [swagger documentation](https://www.realworld.how/docs/specs/frontend-specs/swagger). These types can be placed in `src/api/types.ts`:

```jsx
import { Article } from "../types";

export interface ArticlesResponse {
  articles: Article[];
}

export interface ArticleResponse {
  article: Article;
}
```

</details>

**Remember 💡**: this is the time to ensure that the data type `Article` we have declared in the `./types` folder, matches the types we get from realworld.how's API.

> Here you can see the [API response formats](https://www.realworld.how/docs/specs/backend-specs/api-response-format) from realworld.how. Check out [**Single Article**](https://www.realworld.how/docs/specs/backend-specs/api-response-format/#single-article) and **[Multiple Articles](https://www.realworld.how/docs/specs/backend-specs/api-response-format/#multiple-articles)**.

Now that we fetch the data from the external backend the like functionality does no longer work. This is because we no longer update the actual article object, only the local cahced version which gets overwritten on every fetch to the backend. Try liking an article the refresh, or like an article in the Article-page then go back to the main page and see the live overwriting.

# Realworld.how API - authenticate login

The goal is to integrate actual API calls for user login/signup with authentication. Here we will make use of browser storage, `localStorage` to store user data throughout the sessions. You will learn to handle requests and responses with authirization and how to setup features that require user-authentication.

---

## Tasks

In order to get the like-functionality working again we need to add user-login, since this feature is only available for authenticated users in the API we are using.

### 1. Create Login page with Route and navbar element

To start of we need to create a Login-page that users will be redirected to when routing to `/login`, and a way for users to get to that page - (a new link for instance).

- Adding another Link to the `Header` component for the `/login` path.
- Add the route to `App.tsx`.
- Create the route element (new `Login`-page).
  - Create a form containing two inputs - username/email and password.
  - Create states to handle live update of user inputs to these fields

<details>
<summary> Suggestion 💡</summary>

**Header.tsx**

```jsx
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>Conduit</h1>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
```

**App.tsx**

```jsx
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Article from "./pages/Article/Article";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import store from "./state/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
```

**Login.tsx**

```jsx
import { useState } from "react";
import Header from "../../components/Header/Header";
import "./Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Header />
      <form className="login-form">
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
        <div className="button-container">
          <button type="submit">Sign in</button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
```

**Login.css**

```css
.login-form {
  max-width: 480px;
  margin: 0 auto;
  margin-top: 60px;
}

.login-form .login-header {
  text-align: center;
  font-size: 2.25rem;
  margin-top: 0;
  margin-bottom: 1rem;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.login-form input {
  font-size: medium;
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.login-form .button-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.login-form button {
  font-size: medium;
  display: inline-block;
  padding: 1rem 1.5rem;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #3d8b3d;
}
```

</details>

### 2. Authenticate through the external endpoint

Currently the `Login`-page does very little. Let's add the missing logic to make it actually do something useful.

- Add functionality to handle the sumbitting of the form - create `handleSubimt()`-function and add it to the form onSubmit.
- Add fetch call to `/users/login` (See: [User and Authentication](https://www.realworld.how/docs/specs/frontend-specs/swagger)).
  - _NOTE:_ This step assumes the participants has a test user or if using the realWorld.how endpoints they should have created a user there.
- Create the `User` interface that defines the user-object according to the response structure defined in the documentation - [User object response](https://www.realworld.how/docs/specs/backend-specs/api-response-format#users-for-authentication).

This code alone will not work as authentication - all this does is pass the provided email and password to the backend and get a response verifying it the credentials are correct and return and object accordingly. We are not actually using the response for anything useful yet. Here you can have a look at the response structures: [User response format](https://www.realworld.how/docs/specs/backend-specs/api-response-format/#users-for-authentication).

As you can see in the documentation RealWorld.how uses `JWT`-tokens as a means to provide authorisation. Provided in the LoginResponse token attribute.

<details>
<summary> Suggestion 💡</summary>

**Login.tsx**

```jsx
import { login } from "./../../api/axios";
...
const navigate = useNavigate();

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        await login(email, password);
        navigate(-1);
    } catch (error) {
        console.log("Login failed");
    }
};
...
<form className="login-form" onSubmit={handleSubmit}>
```

**axios.ts**

```jsx
import axios from "axios";
import { Article, User } from "../types";
...

interface LoginResponse {
  user: User
}

...

export const login = async (email: string, password: string) => {
  const res = await api.post<LoginResponse>("/users/login", {
    user: { email, password },
  });
  return res.data.user;
};

```

**types.ts**

```js
...
export interface User {
  email: string;
  username: string;
  bio: string;
  image: string;
  token: string;
}
```

</details>

### 3. Setup interceptors and localStorage

The code above alone will not work. Indeed the user credentials have been sent and accespted by the API but we need to make use of the authentication token in our subsequent requests and responses to associate these with the respective user. All the implementation does so far is pass the provided email and password to the backend and get a response verifying it the credentials are correct and return and object accordingly. We are not actually using the authentication response for anything useful yet.

Here you can have a look at the response structure: [User response format](https://www.realworld.how/docs/specs/backend-specs/api-response-format/#users-for-authentication).

As you can see in the documentation, RealWorld.how uses `JWT`-tokens as a means to provide authorisation. Provided in the `token` attribute.

<details>
<summary>🔍 Don't know what JWT-tokens are? Here is a brief explanation</summary>
> **JWT (JSON Web Tokens)**
> JWT is a secure way to transmit information between a client and a server. It allows the server to authenticate and authorize the client based on the information contained within the token.
</details>

We need to add an **interceptors** from axios to our instance - to apply the authorisation header to the requests and handle the authentication errors or token expiration in the responses.

> **Axios interceptors:** Axios interceptors are a feature provided by the Axios library that allow you to intercept and modify HTTP requests or responses before they are handled by your application. They provide a way to globally handle common behaviors, such as handling authentication.

- Define an interceptor for requests - to add the token in the `Authorization header`.
- Define an interceptor for **responses** to handle authentication errors or token expiration.
- Store the token in localStorage for persistance between sessions.
  - Set the token on login.
  - Check the token before sending requests, use it in the request header.

<details>
<summary> Suggestion 💡</summary>

**axios.ts**

```jsx
// Request Interceptor
// The interceptor below checks if a JWT token exists in `localStorage` on the `user`-object we will store there. If it does, it adds it to the Authorization header with the "Bearer" scheme.
api.interceptors.request.use((config) => {
  const userString = localStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString) as User;
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Response Interceptor
// This interceptor checks if the response has a status code of 401 (Unauthorized). In such cases, you can handle the error as needed, we choose to redirects the user to the login page - since this error often indicates that the user has not been authenticated or the old token has expired.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const res =
    (await api.post) <
    LoginResponse >
    ("/users/login",
    {
      user: { email, password },
    });
  const userString = JSON.stringify(res.data.user);
  localStorage.setItem("user", userString);
  return res.data.user;
};
```

In this setup it makes sense for us to use `localStorage` (_see explenation below_) - i.e. we get the item from storage using the key `jwt`. For this to work we need to adjust the `login()`-function to **set** the value of this _storage-key_ to the user specific token returned in the authentication request.

</details>

Verify the setup by checking the storage values in your browser inspect-tool.

**Browser Storage:** Browser storage allows web applications to store data locally on a user's web browser. There are two types of storage: local and session.

- **Local Storage:** Local storage is a type of browser storage that allows web applications to store key-value pairs in the web browser. The data stored in local storage remains there until explicitly removed by the web application or the user.

  - Local storage is typically used for storing relatively long-term data

- **Session Storage:** Session storage allows web applications to store data on a per-session basis. The data stored in session storage is available only within the current browsing session and is cleared when the user closes the browser or tab.
  - This makes session storage suitable for maintaining temporary data or state that should not persist across different browser sessions. When the user opens a new tab or window, a new session is created, and session storage for that session is separate from other sessions.

These storage mechanisms provide web developers with convenient ways to store and manage data on the client-side, enhancing the user experience by making web applications more responsive and personalized.

### 4. Show authentication status in Header

To make it more visible to the user that they successfully logged in let's update the header component to display user data. While we are here it can also be useful for the user to be able to logout. This functionality we can add inside a dropdown-box - a common functionality that reiles on the `useState`-hook for storing a simple open/closed-boolean state.

- Open the header component `Header.tsx`
- Add a local state to hold a user object.
- Set the user state in a useEffect that checks localStorage.
- Ensure to conditionally render the login button when user state is null and the user-info if the object exists.
- Add new local state to hold the toggle value for a dropdown menu (open/closed)
- Add button to dropdown and a handle sign-out function if user is logged in
- (optional) add event-listener to close dialog on click-outside.

<details>
<summary> Suggestion 💡</summary>

**Header.tsx (before signout)**

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../types";
import "./Header.css";

const Header = () => {
  const [user, setUser] = (useState < User) | (null > null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      setUser(null);
    } else {
      setUser(JSON.parse(userString));
    }
  }, [user]);

  return (
    <header className="header">
      <h1>Conduit</h1>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {user ? (
              <div className="user-info">
                <img src={user.image} alt={`${user.username}'s avatar`} />
                <p>{user.username}</p>
              </div>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
```

```css
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
}
```

**Header.tsx (after signout)**

```jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = (useState < User) | (null > null);
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      setUser(null);
    } else {
      setUser(JSON.parse(userString));
    }
  }, [user]);

  return (
    <header className="header">
      <h1>Conduit</h1>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {user ? (
              <>
                <div
                  className="user-info"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <img src={user.image} alt={`${user.username}'s avatar`} />
                  <p>{user.username}</p>
                </div>
                {open && (
                  <div className="dropdown-menu">
                    <button onClick={handleSignOut}>Sign out</button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
```

```css
.dropdown-menu {
  position: absolute;
  right: 10px;
  top: 50px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

.dropdown-menu button {
  all: unset;
  cursor: pointer;
}
```

</details>

### 5. Move user state to Redux

The current setup will update the header, but the state that indicates that the user is logged in or not is information we will be needing in several places - to get the like-functionality back in business.

- Add a new key-value pair to the initialState in `appSlice.ts` - and interface.
  - This key will hold the user object after authentication, othervise be `null`.
- Create `signin` reducer that sets the user object to the payload.
- Create `signout` reducer that re-sets the user object to null - and re-sets articles and selectedArticleSlug to remove user specific data from view.
- Create user selector to access the user state
- Export the selector and new reducers.
- Update `Header.tsx` to make use of this state and reducers instead.
- Address that signout now don't trigger rerender after navigation.
  - Add `user` as dependency to `fetchArticles` in `Home.tsx` - to ensure fetch is called upon user state change.

<details>
<summary> Suggestion 💡</summary>

**appSlice.ts**

```jsx
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Article, User } from "../types";
import { RootState } from "./store";

interface AppState {
  articles: Article[];
  selectedArticleSlug: string | null;
  user: User | null;
}

const initialState: AppState = {
  articles: [],
  selectedArticleSlug: null,
  user: null,
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
    signin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    signout: (state) => {
      state.user = null;
      state.articles = [];
      state.selectedArticleSlug = null;
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

export const { loadArticles, loadArticle, submitFavorite, signin, signout } =
  appSlice.actions;

export default appSlice.reducer;
```

**Header.tsx**

```jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUser, signin, signout } from "../../state/appSlice";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    dispatch(signout());
    setOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!user && userString) {
      dispatch(signin(JSON.parse(userString)));
    }
  }, [user]);

  return (
    <header className="header">
      <h1>Conduit</h1>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {user ? (
              <>
                <div
                  className="user-info"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <img src={user.image} alt={`${user.username}'s avatar`} />
                  <p>{user.username}</p>
                </div>
                {open && (
                  <div className="dropdown-menu">
                    <button onClick={handleSignOut}>Sign out</button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
```

**Home.tsx**

```jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../../api/axios";
import { loadArticles, selectArticles, selectUser } from "../../state/appSlice";
import ArticlePreview from "./../../components/ArticlePreview/ArticlePreview";
import Header from "./../../components/Header/Header";
import "./Home.css";

const Home = () => {
  const articleList = useSelector(selectArticles);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetch = async () => {
      try {
        const articles = await fetchArticles();
        dispatch(loadArticles(articles));
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetch();
  }, [dispatch, user]);
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

### 6. Make us of favorite and unfavorite endpoints

With the user authentication now configured we can get the like-functionality back - let's move into `axios.ts` to add the backend-communication needed.

The endpoints needed for this can be found in the [swagger documentation](https://www.realworld.how/docs/specs/frontend-specs/swagger) under the header **Favorites** - here we will need two functions:

- One relying on a `POST`-request to register a new favorite, and
- One for the `DELETE`-request to unfavorite,
  Both relying on the relevant `slug`-identifier and user authentication to connect the like to the user and specific article.

- Add async favorite function.
- Add async unfavorite function.
- Use the two functions in the file where you handle like-functionality
- Redirect the user to the login page if they try to like an article without authentication

<details>
<summary> Suggestion 💡</summary>

**axios.ts**

```jsx
export const favoriteArticle = async (slug: string) => {
  const res = (await api.post) < ArticleResponse > `/articles/${slug}/favorite`;
  return res.data.article;
};

export const unFavoriteArticle = async (slug: string) => {
  const res =
    (await api.delete) < ArticleResponse > `/articles/${slug}/favorite`;
  return res.data.article;
};
```

**ArticleMeta.tsx**

```jsx
import { useDispatch } from "react-redux";
import { favoriteArticle, unFavoriteArticle } from "../../api/axios";
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
        onClick={async () => {
          try {
            if (article.favorited) {
              await unFavoriteArticle(article.slug);
            } else {
              await favoriteArticle(article.slug);
            }

            dispatch(submitFavorite(article.slug));
          } catch (error) {
            console.log("Error updating favorite");
          }
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

### 6. Relocate localStorage logic

Using `localStorage`-reference multiple places like we do now is not that clean, for improved code readability, maintainability and error handling we could optionally move this logic into its own file to hold all logic relevant for accessing, updating and deleting values in storage in the same place. Let's create the `storage.ts`-file. This file will hold our localStorage logic - get user, set user and remove user.

- Create a `storage.ts` file
  - Add function for `getting` user object.
  - Add function for `setting` user object.
  - Add function for `removing` user object.
- Use these new functions in the location that now access localStorage directly:
  - axios.ts - interceptors and login
  - Header.ts - signout handler

<details>
<summary> Suggestion 💡</summary>

**storage.ts**

```jsx
import { User } from "./types";

export const getUserFromLocalStorage = (): User | null => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    const user = JSON.parse(userString);
    return user;
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user from local storage:",
      error
    );
    return null;
  }
};

export const setUserToLocalStorage = (user: User) => {
  try {
    const userString = JSON.stringify(user);
    localStorage.setItem("user", userString);
  } catch (error) {
    console.error(
      "An error occurred while saving the user to local storage:",
      error
    );
  }
};

export const removeUserFromLocalStorage = () => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error(
      "An error occurred while removing the user from local storage:",
      error
    );
  }
};
```

**axios.ts**

```jsx
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  setUserToLocalStorage,
} from "../storage";
...
api.interceptors.request.use((config) => {
  const user = getUserFromLocalStorage();
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeUserFromLocalStorage();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
...
export const login = async (email: string, password: string) => {
  const res = await api.post<LoginResponse>("/users/login", {
    user: { email, password },
  });
  setUserToLocalStorage(res.data.user);
  return res.data.user;
};

```

**Header.tsx**

```jsx
...
 const handleSignOut = () => {
    removeUserFromLocalStorage();
    dispatch(signout());
    setOpen(false);
    navigate(-1);
  };
...
```

</details>

### 7. Optional - Improve user feedback on like

Currently after login and clicking like-button there is a slight delay. To improve user feedback and experience we can set the like button to disabled state while it loads and attempts to update in the backend.

- Add loading state to `ArticleMeta.tsx`
- Set disabled stat to loading state value
- Style the button accordingly - diable and make darker to indicate loading and processing the action.

<details>
<summary> Suggestion 💡</summary>

**ArticleMeta.tsx**

```jsx
const [loading, setLoading] = useState(false);
...
<button
    className={article.favorited ? "favorited" : ""}
    disabled={loading}
    onClick={async () => {
      try {
        setLoading(true);
        if (article.favorited) {
          await unFavoriteArticle(article.slug);
        } else {
          await favoriteArticle(article.slug);
        }
        dispatch(submitFavorite(article.slug));
        setLoading(false);
      } catch (error) {
        console.log("Error updating favorite");
      }
    }}
>
    Like {article.favoritesCount}
</button>
```

```css
.article-meta button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
```

</details>
