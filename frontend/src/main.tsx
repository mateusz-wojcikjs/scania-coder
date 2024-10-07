import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login.tsx";
import { GlobalStyle } from "./theme/GlobalStyles.ts";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.ts";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";
import { ConfigProvider } from "antd";
import { customTheme } from "./theme/antdConfig.ts";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Dashboard from "./views/Dashboard.tsx";
import { MainTemplate } from "./components/templates/mainTemplate/mainTemplate.component.tsx";
import Root from "./views/Root.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainTemplate>
          <Root />
        </MainTemplate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainTemplate>
          <Dashboard />
        </MainTemplate>
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ConfigProvider theme={customTheme}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>,
);
