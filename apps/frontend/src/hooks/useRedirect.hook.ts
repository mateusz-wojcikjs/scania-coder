import { Location, useLocation } from "react-router-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UseRedirect, RedirectOptions } from "../interfaces";

export const useRedirect: () => UseRedirect = (): UseRedirect => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const BACK_BUTTON_INDEX: number = -1;
  const EMPTY_OBJECT_LENGTH: number = 0;
  const redirect: (redirectOptions: RedirectOptions) => void = (redirectOptions: RedirectOptions): void => {
    const { targetRoute, params, searchParams, isExternalUrl, inNewTab, goBack }: RedirectOptions = redirectOptions;

    if (goBack) {
      navigate(BACK_BUTTON_INDEX);
      return;
    }

    if (!targetRoute || targetRoute === location.pathname) {
      return;
    }

    let modifiedPath: string = targetRoute;
    const paramsEntries: [string, string | number][] = Object.entries(params ?? {});
    for (const [key, value] of paramsEntries) {
      modifiedPath = modifiedPath.replace(`:${key}`, encodeURIComponent(value.toString()));
    }

    if (searchParams && Object.keys(searchParams).length > EMPTY_OBJECT_LENGTH) {
      const query: URLSearchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        query.append(key, value.toString());
      }
      modifiedPath += `?${query.toString()}`;
    }

    if (isExternalUrl && !inNewTab) {
      window.location.assign(modifiedPath);
    } else if (inNewTab) {
      window.open(modifiedPath, "_blank")?.focus();
    } else {
      navigate(modifiedPath);
    }
  };

  return { redirect };
};