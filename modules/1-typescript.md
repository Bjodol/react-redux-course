# Typescript

Recommended documentation

- [Getting started](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Purpose

To provide typesafety to your code.

Benefits:

- Catching errors and bugs before hitting production
- Document interfaces and code

## Basic types [Demo]

```ts
// Text
const name: string = "My Character";
// Number
const age: number = 23;
// Boolean
const isRobot: boolean = true;
// Multiple types
const id: string | number = "Some string" || 123;
// Null or undefined;
const hasColorSight: boolean | null | undefined;
// Functions
type IsSith = (name: string) => boolean;
const isSith: IsSith = (name: string) => name.includes("Darth");
function isSith(name: string): boolean {
  return name.includes("Darth");
}

// Object
// First defining the shape of the object
type Character = {
  name: string;
  age: number;
  isRobot: boolean;
};

// Then assigning the shape to the variable.
const character: Character = {
  name: "My Character",
  age: 23,
  isRobot: true,
};

// Optional fields
// By appending a `?` to the field name we mark it as optional.
type Character = {
  name: string;
  age: number;
  isRobot?: boolean;
};

const character: Character = {
  name: "My Character",
  age: 23,
};

// Array
// Any shape or type can be an array by appending the `[]` after the typename
const names: string[] = ["Luke", "Darth Vader"];
const characters: Character[] = [
  {
    name: "RD-D2",
    age: 56,
    isRobot: true,
  },
  {
    name: "Darth Vader",
    age: 40,
    isRobot: false,
  },
];

// Nested shapes
// Fithin a shape you can utilize other objects by using the typename.
type Planet = {
  name: string;
  numberOfMoons: string;
  characters: Character[];
};

// Combining types
type SolarSystem = Planet & { numberOfStars: number };
```

### Tasks

0. Create a file called `types.ts`.
1. Create a new type for an `Article`. It should contain the following fields: `title`, `description`, `rating`, `hasRead`, `views` and `publishedAt`.
2. Add another type for `Author` with appropriate fields.
3. Add the `Author` type to a the `Article` type.
4. Create another type `ArticleList` which holds an array of articles.
5. Create a variable with the type `ArticleList` and populate the variable with three articles.

<details>
<summary> Suggestion 💡</summary>

```ts
type Article = {
  title: string;
  description: string;
  rating: number;
  hasRead: boolean;
  views: number;
  publishedAt: string;
  author: Author;
};

type Author = {
  name: string;
  nickname: string;
  age: number;
};

type ArticleList = Article[];

const articles: ArticleList = [
  {
    title: "article-1",
    description: "description-1",
    rating: 3,
    hasRead: true,
    views: 4,
    publishedAt: "2023-09-06",
    author: {
      name: "author-1",
      nickname: "1",
      age: 30,
    },
  },
  {
    title: "article-2",
    description: "description-2",
    rating: 3,
    hasRead: true,
    views: 4,
    publishedAt: "2023-09-06",
    author: {
      name: "author-2",
      nickname: "2",
      age: 30,
    },
  },
  {
    title: "article-3",
    description: "description-3",
    rating: 3,
    hasRead: true,
    views: 4,
    publishedAt: "2023-09-06",
    author: {
      name: "author-3",
      nickname: "3",
      age: 30,
    },
  },
];
```

</details>

## Advanced types [Demo]

### Generics

```ts
type Character<G> = {
  name: string;
  attributes: G;
};

type Robot = { powerConsumption: number; canFly: boolean };
type Humanoid = { species: string; canUseForce: boolean };

const robot: Character<Robot> = {
    name: "RD-D2",
    attributes: {
        powerConsumption: 2;
        canFly: false;
    }
}

const human: Character<Humanoid> = {
    name: "Luke",
    attributes: {
        species: "human";
        canUseForce: true;
    }
}
```

### Utility types

```ts
// Create new type from existing type
type ForceRobot = Pick<Robot, "powerConsumption"> &
  Pick<Humanoid, "canUseForce">;
const forceRobot: ForceRobot = { powerConsumption: 42, canUseForce: true };

// Omit something fra existing type
type Human = Omit<Humanoid, "species">;
const human: Human = { canUseForce: false };

// Make fields optional
type Statue = Partial<Robot>;
const statue = {};

// Make field required;
type EnergizedStatue = Required<Status>;
const statue = { powerConsumption: 42, canFly: false };
```

### Tasks

1. Create a type `ArticleTeaser` containing a subset of the fields from `Article`.
2. Make a generic type for a network response which contains a `responseCode` and a `data` payload which can be either `Article` or `ArticleTeaser`.

<details>
<summary> Suggestion 💡</summary>

```ts
type ArticleTeaser = Pick<Article, "title" | "rating" | "views">;

type ArticleResponse<G extends Article | ArticleTeaser> = {
  responseCode: number;
  data: G;
};
```

</details>

## Bonus task

1. Based on the real world example create more types. This can be useful down the line.
