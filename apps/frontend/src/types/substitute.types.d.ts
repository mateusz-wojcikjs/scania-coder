import { FastOmit } from "./fastOmit.type";

export type Substitute<A extends object, B extends object> = FastOmit<A, keyof B> & B;
