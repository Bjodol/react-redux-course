# Data fetching

## Purpose

Add backend communication to our application by fetching articles from the Realworld.how API. We will learn the principles of making asynchronous API calls using async and await syntax and utilize the useEffect hook to perform these calls.

---

## Tasks

So far in the application, we have dealt with dummy data that has been locally stored - the `articles.ts` file. The next step is to instead fetch our data from **Realworld.how's API**. The endpoint we will use to fetch articles is served here https://api.realworld.io/api/articles.

> To see all endpoints available, take a look at them [here](https://www.realworld.how/docs/specs/backend-specs/endpoints).

**Async calls ⏳**: When we introduce data sources from external sources, we are introducing `async` function calls. When we call external APIs (i.e. applications running on another server than the frontend project, like realworld.how), it often means that the response will not be ready immediately as the code is running. The way code knows to "wait" for response, is by calling them `async`. Any async code has to be wrapped in async code up to the "highest level", which is an important thing to remember to really understand how to call and use async calls.

> **Code compiling and non-async calls 💡**: Code compiles line by line and is non-async by default. If a call is sent out and takes some time to respond, non-async code lines will jump straight to the next line with "empty"/missing response from external APIs.

**fetch**: To call an external API, we will use the browser built-in `fetch` method. [mdn](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

### 1. Replace dummy data with API data.

To implement the realworld.how data, go to the place in your code that uses the current dummy data from `articles.ts`. In our example, this is currently set in our Redux store initial value.

- In `appSlice` remove the articles import and replace the initial articles value to be an empty array.
- Move the initializing logic to `Home.tsx` - Using useEffect and async/awit function calls with `fech`.
- Do the same for `Article.tsx` to re-fetch on page reload.

<details>
<summary> Suggestion 💡</summary>

**Home.tsx**

```tsx
useEffect(() => {
  const fetch = async () => {
    try {
      const response = await fetch("https://api.realworld.io/api/articles", {});
      const data = await response.json();
      dispatch(loadArticles(response.data.articles));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  fetch();
}, [dispatch]);
```

**Article.tsx**

```tsx
const dispatch = useDispatch();
const article = useSelector(selectArticle);
const params = useParams();
useEffect(() => {
  const fetchArticles = async () => {
    if (!article) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.realworld.io/api/articles/${params.slug}`
        );
        const data = await response.json();
        dispatch(loadArticles([data.article]));
        if (params.slug) dispatch(loadArticle(data.article.slug));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  fetchArticles();
}, [article, dispatch, params.slug]);
```

</details>

Since the loadArticle - rely on getting an article from the articles array in store - we need to update this array as well to enable refresh of article-pages. By adding `dispatch(loadArticles([response.data.article]))` we update both the array and the selected article in our store.

Async function calls inside useEffect - Here we define an async function within the useEfect that we call after defining it. This is recommended syntax for this common scenario. When making asynchronous calls in React using useEffect, it's recommended to wrap the async call in a separate function inside useEffect rather than calling it directly. This approach helps prevent infinite loops and keeps code organized. By separating the async call, you can easily specify dependencies for the effect, ensuring it runs only when necessary. Additionally, it allows for cancellation or cleanup of the async call when the component unmounts.

### 3. Create an api folder.

For scalability and easier maintenance it is smart to move the api logic in its own file. For instance if the endpoint urls now were to change this would require changes to both page-files.

- Create `src/api/articles.ts` - location for our endpoint logic
- Move the endpoint logic just added into this file.
  - (Now the files complain about type)
- Define response types to the api calls.
- Update the async-awiat in Home and Article to use these new api fetch calls.

<details>
<summary> Suggestion 💡</summary>

**articles.ts**

```tsx
import { Article } from "../types";

interface ArticlesResponse {
  articles: Article[];
}

interface ArticleResponse {
  article: Article;
}
export const fetchArticles = async () => {
  const response = await fetch("https://api.realworld.io/api/articles");
  const data: ArticlesResponse = await response.json();
  return data.articles;
};
export const fetchArticleBySlug = async (slug: string) => {
  const response = await fetch(`https://api.realworld.io/api/articles/${slug}`);
  const data: ArticleResponse = await response.json();
  return data.article;
};
```

**Home.tsx**

```tsx
const dispatch = useDispatch();
useEffect(() => {
  const fetchData = async () => {
    try {
      const articles = await fetchArticles();
      dispatch(loadArticles(articles));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  fetchData();
}, [dispatch]);
```

**Article.tsx**

```tsx
const dispatch = useDispatch();
const article = useSelector(selectArticle);
const [loading, setLoading] = useState < boolean > false;
const params = useParams();
useEffect(() => {
  const fetchArticle = async () => {
    if (!article) {
      setLoading(true);
      try {
        if (!params.slug) throw new Error("Missing slug");
        const article = await fetchArticleBySlug(params.slug);
        dispatch(loadArticles([article]));
        if (params.slug) dispatch(loadArticle(article.slug));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  fetchArticle();
}, [article, dispatch, params.slug]);
```

To ensure type-safety we should also add the types that the responses from the endpoint follow. This can be seen in the [swagger documentation](https://www.realworld.how/docs/specs/frontend-specs/swagger). These types can be placed in `src/api/types.ts`:

```tsx
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
