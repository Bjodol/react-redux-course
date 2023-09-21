import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ArticlePage } from "./pages/Article";
import { LoginPage } from "./pages/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const MyApp: FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* <AuthContexProvider> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
        {/* </AuthContexProvider> */}
      </QueryClientProvider>
    </Provider>
  );
};
