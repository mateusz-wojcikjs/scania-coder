
import { Navigate, useLocation } from "react-router-dom";
import { UseAuth, UseRoutingPermission } from "../../interfaces";
import { useAuth, useRoutingPermission } from "../../hooks";
import { RoutingPath } from "../../enums";
import { AccessDeniedView } from "../../views";
import { ProtectedRouteProps } from "./protectedRoute.types";

export const ProtectedRoute: (props: ProtectedRouteProps) => JSX.Element = (props: ProtectedRouteProps): JSX.Element => {
  const { children } = props;
  const { userData, isUserLoggedIn, token }: UseAuth = useAuth();
  const { checkRoutePermission }: UseRoutingPermission = useRoutingPermission();
  const location = useLocation();
  const pathname = location.pathname as RoutingPath;
  const unauthenticatedRoutes: RoutingPath[] = [RoutingPath.Login, RoutingPath.SetupPassword];

  if (!token && !unauthenticatedRoutes.includes(pathname)) {
    return <Navigate to={RoutingPath.Login} />;
  }

  if (token) {
    if (unauthenticatedRoutes.includes(pathname)) {
      return <Navigate to={RoutingPath.Root} />;
    } else if (checkRoutePermission(pathname)) {
      return children;
    } else {
      return <AccessDeniedView />;
    }
  }

  if (!isUserLoggedIn || !userData?.email) {
    return <Navigate to={RoutingPath.Login} />;
  }

  return children;
};
