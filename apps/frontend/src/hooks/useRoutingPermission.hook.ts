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
    if (matchPath(RoutingPath.LayoutsDetails, pathname)) {
      return !!userData?.email;
    }
    if (matchPath(RoutingPath.UsersDetails, pathname)) {
      return !!userData?.isAdmin;
    }

    switch (pathname) {
    case RoutingPath.Login:
      return true;
    case RoutingPath.Layouts:
    case RoutingPath.Root:
    case RoutingPath.Profile:
      return !!userData?.email;
    case RoutingPath.Users:
    case RoutingPath.UsersAdd:
      return !!userData?.isAdmin;
    default:
      return false;
    }
  };
  return { checkRoutePermission, isMenuItemAvailable };
};
