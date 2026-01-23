import { MenuItem } from "types";
import { RoutingPath } from "../../enums";

export interface UseRoutingPermission {
  checkRoutePermission: (pathname: RoutingPath) => boolean;
  isMenuItemAvailable: (menuItem: MenuItem) => boolean;
}