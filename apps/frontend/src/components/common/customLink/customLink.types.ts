import { ReactElement } from "react";
import { RoutePath } from "../../../types";

export interface CustomLinkProps {
  to: RoutePath;
  children: ReactElement | string;
}