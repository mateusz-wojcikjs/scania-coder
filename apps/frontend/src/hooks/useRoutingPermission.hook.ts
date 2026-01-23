import { matchPath } from "react-router-dom";
import { useAuth } from "./useAuth.hook";
import { RoutingPath } from "../enums";
import { UseAuth, UseRoutingPermission } from "../interfaces";
import { MenuItem } from "../types";

export const useRoutingPermission: () => UseRoutingPermission = (): UseRoutingPermission => {
  const { userData }: UseAuth = useAuth();

  const isMenuItemAvailable: (menuItem: MenuItem) => boolean = (menuItem: MenuItem): boolean => {
    if (!menuItem.permissionScope) return true;
    return !!menuItem.permissionScope === userData?.isAdmin;
  };

  const checkRoutePermission: (pathname: RoutingPath) => boolean = (pathname: RoutingPath): boolean => {
    switch (pathname) {
    case RoutingPath.Login:
      return true;
    case RoutingPath.Layouts:
    case RoutingPath.Root:
    case RoutingPath.Profile:
      return !!userData?.email;
    case RoutingPath.Users:
    case RoutingPath.UsersAdd:
    case matchPath(RoutingPath.UsersDetails, pathname)?.pathname:
      return !!userData?.isAdmin;
    default:
      return false;
    }
  };
  return { checkRoutePermission, isMenuItemAvailable };
};
