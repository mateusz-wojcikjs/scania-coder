import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import { ROUTE_PATHS } from "./paths.ts";
import { MainTemplate } from "../components";
import { LayoutsList, Login, Root } from "../views";

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.Root,
    element: (
      <ProtectedRoute>
        <MainTemplate>
          <Root />
        </MainTemplate>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTE_PATHS.Login,
    element: <Login />,
  },
  {
    path: ROUTE_PATHS.Layouts,
    element: (
      <ProtectedRoute>
        <MainTemplate>
          <LayoutsList />
        </MainTemplate>
      </ProtectedRoute>
    ),
  },
]);
