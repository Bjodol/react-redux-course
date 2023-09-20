import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ArticlePage } from "./pages/Article";
import { LoginPage } from "./pages/Login";
import { AuthContexProvider } from "./auth-context";

export const MyApp: FC = () => {
  return (
    <AuthContexProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContexProvider>
  );
};
