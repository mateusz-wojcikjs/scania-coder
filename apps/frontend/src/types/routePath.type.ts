import { ROUTE_PATHS } from "../constants";

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
