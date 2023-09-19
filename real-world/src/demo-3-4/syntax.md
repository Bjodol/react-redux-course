## Content

```tsx
const title = "Cake";
<h1>{title}</h1>;
```

```html
<h1 id="my-h1"></h1>
<script>
  const title = "cake";
  const heading = document.getElementById("my-h1");
  heading.innerHTML = title;
</script>
```

## Attributes

```tsx
const title = "Cake";
<h1 className={title}>{title}</h1>;
```

```html
<h1 id="my-h1"></h1>
<script>
  const title = "cake";
  const heading = document.getElementById("my-h1");
  heading.innerHTML = title;
  heading.classList.add(title);
</script>
```

## Event listeners

```tsx
<button onClick={() => alert("Clicked")}>My button</button>
```

```tsx
const myFunction = () => alert("Clicked")
<button onClick={myFunction}>My button</button>
```

```html
<button id="my-btn">My button</button>
<script>
  const button = document.getElementById("my-btn");
  button.addEventListener("click", () => alert("Clicked"));
</script>
```

## Enable javascript to build the dom tree

```tsx
<div>
  {articles.map((article) => {
    return (
      <a href={article.slug}>
        <h2>{article.description}</h2>
        <img src={article.image} />
      </a>
    );
  })}
</div>
```

```html
<div id="container"></div>
<script>
  const divElement = document.getElementById("my-list");

  articles.forEach((article) => {
    const aElement = document.createElement("a");
    aElement.href = article.slug;

    const h2Element = document.createElement("h2");
    h2Element.textContent = article.description;

    const imgElement = document.createElement("img");
    imgElement.src = article.image;

    aElement.appendChild(h2Element);
    aElement.appendChild(imgElement);

    divElement.appendChild(aElement);
  });

  const containerElement = document.getElementById("container");
  containerElement.appendChild(divElement);
</script>
```

## Make reusuable components

```tsx
<ArticlePreview article={article} />
<div data-article={article}> // <div data-article="[Object object]">
<h1>
<ReactComponent/>
```

```html
<div data-article="{article}"></div>
```
