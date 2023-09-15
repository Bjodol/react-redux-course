# Testing

## Purpose

Learn about testing usign `react-testing-library` (RTL). RTL is a light weight, but powerful, testing lirary for testing React components. It encourages testing from the user's perspective and focuses on testing behavior rather than implementation details. We will start by introducing core concepts form RTL, then we will jump into writing our first tests for our current component selection.

## Tasks

Before we jump into the tasks lets go through some of the core concepts from RTL.

1. _Queries_: Queries are functions used to find elements in the rendered output. RTL provides various built-in query functions like `getByText`, `getByRole`, `getByTestId`, etc.

2. _Render_: The `render` function renders a React component into a virtual DOM, allowing you to query and interact with the rendered output.

3. _Fire Events_: Use the `fireEvent` utility to simulate user interactions like clicks, typing, etc.

4. _Assertions_: RTL provides assertion functions like `expect` to check if certain elements or conditions are met in the rendered output.

Fo instance, take this Button component as an example:

```ts
import React from "react";

const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export default Button;
```

For this we could creata a test file that tests the correct rendering and functionality of the component:

```ts
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders a button with the correct label", () => {
  const { getByText } = render(<Button label="Click Me" />);

  const buttonElement = getByText("Click Me");
  expect(buttonElement).toBeInTheDocument();
});

test("calls onClick when the button is clicked", () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button label="Click Me" onClick={handleClick} />
  );

  const buttonElement = getByText("Click Me");
  fireEvent.click(buttonElement);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

Now lets start creating test for our existing components and application functionality using RTL. First things first we need to install `@testing-library/react`:

```
npm i @testing-library/react
```

Additionally we require a few more modules to enable testing properly:

- `@testing-library/jest-dom` - It gives you extra tools to check how your components interact with the web page. Makes your tests more precise and user-focused.
- `happy-dom`/`jsdom` - These fake browsers let you test how components use the web page, even without a real browser. Helps you catch issues and make tests faster.
- `vitest` - A tool tailored for Vite that helps you write and run tests easily. Manages the testing process and gives structure to your tests.

### 1. Create a test for the Loading component

We can start of by creating a small test for the `Loading`-component to get us started:

- Creat a new test file `Loading.test.tsx` in the `Loading`-component folder.
- Make use of `descrbe`, `expect` and `test`, from `vitest`, and `render` from `react-testing-library`.

```ts
describe("Loading Component", () => {
  test("renders loading text and spinner", () => {
    const { getByText } = render(<Loading />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });
});
```

- `describe("Loading Component", () => {});`: This is the start of a test suite (a group of related tests). `describe` is used to define the suite's name.
- `test("renders loading text and spinner", () => {});`: Inside the test suite, a spesific test case is defined using the `test` function. Teh name of this test describes the test case.
- `const { getByText } = render(<Loading />);`: This line is responsible for rendering the component and getting access to utility functions used to find elements in the rendered component.
- `expect(getByText("Loading...")).toBeInTheDocument();`: Here we use the `expect` function to define an expectation. We expect an element with the text "Loading..." to be present in the rendered component. The `toBeInTheDocument`
  function is a matcher that checks if the element is present in the document.

In this test we make use of the _render_ function from RTL, with the `getByText` _query_. We also finish off the test case using the `expect` _assertation_ function from vitest.

### 2. Write tests for your components

- Write tests for each of the components in your components folder.
- Test their rendering content and functionality where applicable.

Our components rely on state data to render properlt. The RTL `render` function renders the components specified just like any React applicaion would. This means any Redux-connected components will require a _Redux-store_ `<Provider>`-component wrapped around them. Additionally, the test code should create a separate Redux store instance for every test, rather than reusing the same store instance and resetting its state. That ensures no values accidentally leak between tests. For this we have provided you with a custom render funtion - `renderWithProviders`. This wrapper accepts setting the initial state of the store.

- Create a test and make use of the _fire events_ concept to simulate events and user interactions. For instance have a look at:
  - TagList.tsx - Test component with props.
  - ArticlePreview.tsx - Navigation event, test routing functionality.
  - ArticleMeta.tsx - Favorite click functionlaity.
  - Header.tsx - Dialog for signed in users.

#### Suggestion 💡:

<details>
<summary>TagList.tsx</summary>

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import TagList from "./TagList";

describe("TagList component", () => {
  const tagList = ["Tag 1", "Tag 2", "Tag 3"];

  test("renders a list of tags", () => {
    const { getByText } = render(<TagList tagList={tagList} />);

    tagList.forEach((tag) => {
      expect(getByText(tag)).toBeInTheDocument();
    });

    const tagElements = screen.getAllByRole("listitem");
    expect(tagElements).toHaveLength(tagList.length);
  });

  test('applies "start" position class', () => {
    const { container } = render(
      <TagList tagList={tagList} position="start" />
    );

    const tagListElement = container.querySelector(".tag-list.tag-list--start");
    expect(tagListElement).not.toBeNull();
  });
});
```

</details>

<details>
<summary>ArticlePreview.tsx</summary>
TODO - Add functioning test code
</details>

<details>
<summary>ArticleMeta.tsx</summary>
TODO - Add functioning test code
</details>
<details>
<summary>Header.tsx</summary>
TODO - Add functioning test code
</details>

### 3. Testing pages

Having tested all files in our `components folder`, we can move into the pages folder. Her testing the user flows and interactions is neccessary to ensure expected behvior.

- Test login-logout flow.
- Test navigation from `Home` to `Article` page.
- Test changing pages - `pagination`.

The rest of the functionality ha sbeen tested in the component levels. So here the high-level navigation is beign tested.

Note: ArticleMeta tests the `like`-functionality. Header tests login and logout functionality.

### 4. Test coverage

_Frontend test coverage_ means checking how much of your website or web app's code is tested by automated tests. It helps ensure your site works correctly and avoids problems.

- _Why?_ To make sure your website works as expected and to catch problems early.
- _What?_ Measuring which parts of your code are tested.
- _When?_ While building and before launching your site.
- _How?_ Use testing tools to write and run tests for your site's features.

**V8 Code Coverage**:
V8 code coverage is a tool for JavaScript code that shows which lines of code are used and which are not. It is particularly useful for tracking how thoroughly your JavaScript code is being exercised by your tests or real-world usage. It assists in locating areas of your codebase that require additional testing and can help you achieve higher code quality.

`vitest` supports Native code coverage with `v8` and instrumented code coverage with `istanbul`. By default, `v8` will be used.

Try running `npm test -- --coverage` - This command runs our defined test script with the `--coverage` flag set. This will prompt you to install the support package for `v8` automatically.

> **Note:** (Optionally) Create a new script in `package.json` for the coverage command.
>
> ```
> "coverage": "vitest run --coverage"
> ```

This command will produce a report showing how much of your code had been covered by your tests this far. It will specificallly point out lines and files not currently covered.

- Produce a test coverage report.
- Add tests for the code not covered.

<details>
<summary>Suggestion💡</summary>
TODO - Add relevant test code
<details>
