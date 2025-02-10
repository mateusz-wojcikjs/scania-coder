import { IStyledComponent } from "styled-components";
import { Substitute } from "./substitute.types";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type StyledComponents<E extends object = object> = IStyledComponent<"web", Substitute<any, E>>;
