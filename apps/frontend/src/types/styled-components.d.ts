import { IStyledComponent } from "styled-components";
import { Substitute } from "./substitute.types";

export type StyledComponents<E extends object = object> = IStyledComponent<"web", Substitute<any, E>>;
