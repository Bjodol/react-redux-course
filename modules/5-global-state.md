# Global state and propdrilling

Things that are app wide can often be cumbersome to use across the app. A common pattern is to move these kinds of values to what we call global state. Global state in react is implemented through what we call a react context. A context is used through its Provider component which enables us to set the contexts value for all child components.

```tsx
type MyContextType = {
  lightswitch: "on" | "off";
  setLightswitch: (value: "on" | "off") => void;
};

export const myContext = createContext<MyContextType>({ lightswitch: "off" });

export const MyContextProvider: FC<{ children: ReactNode }> = () => {
  const [state, setState] = useState<Pick<MyContextType, "lightswitch">>({
    lightswitch: "off",
  });
  return (
    <MyContext.Provider
      value={{
        lightswitch: state.lightswitch,
        setLightswitch: (value: "on" | "off") =>
          setState((prev) => {
            return {
              ...state,
              lightswitch: prev.lightswitch === "on" ? "off" : "on",
            };
          }),
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
```

Some good learning material [react.dev](https://react.dev/learn/scaling-up-with-reducer-and-context)

## Tasks:

1. Create a context called `AuthContext` which will store the user info, a boolean if the user is logged in and a setter to change the the login status.
2. Create a context Provider called `AuthProvider` from the `AuthContext`. It should check if the user is logged in when the component is mounted.
3. Add the `AuthProvider` as the top node of your app.
4. Update the login form to update the context when a user logs in.
5. Disable the favorite button if the user isn't logged in by using the hook: `useContext(AuthContext)`;
6. Create logout functionality for the app.
