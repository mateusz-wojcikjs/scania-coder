import { RedirectOptions } from "../common";

export interface UseRedirect {
    redirect: (redirectOptions: RedirectOptions) => void;
}