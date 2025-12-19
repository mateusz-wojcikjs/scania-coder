import { createBrowserRouter } from "react-router-dom";
import { ROUTE_PATHS } from "./paths.ts";
import { MainTemplate, ProtectedRoute } from "../components";
import { LayoutsList, Login, Root, SetupPassword, UsersAdd, UsersList, UserDetailsView, ProfileView } from "../views";
import { RemindPassword } from "../views";

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.Root,
    element: (
      <ProtectedRoute>
        <MainTemplate title="sc.fe.views.root.title">
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
    path: ROUTE_PATHS.ForgotPassword,
    element: <RemindPassword />,
  },
  {
    path: ROUTE_PATHS.Layouts,
    element: (
      <ProtectedRoute>
        <MainTemplate title="sc.fe.views.layoutsList.title">
          <LayoutsList />
        </MainTemplate>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTE_PATHS.SetupPassword,
    element: <SetupPassword />,
  },
  {
    path: ROUTE_PATHS.Users,
    element:
     (
       <ProtectedRoute>
         <MainTemplate title="sc.fe.views.usersList.title">
           <UsersList />
         </MainTemplate>
       </ProtectedRoute>
     ),
  },
  {
    path: ROUTE_PATHS.UsersAdd,
    element:
     (
       <ProtectedRoute>
         <MainTemplate title="sc.fe.views.usersAdd.title">
           <UsersAdd />
         </MainTemplate>
       </ProtectedRoute>
     ),
  },
  {
    path: ROUTE_PATHS.UsersDetails,
    element: (
      <ProtectedRoute>
        <UserDetailsView />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTE_PATHS.Profile,
    element: (
      <ProtectedRoute>
        <MainTemplate title="sc.fe.views.profile.title">
          <ProfileView />
        </MainTemplate>
      </ProtectedRoute>
    ),
  },
]);
