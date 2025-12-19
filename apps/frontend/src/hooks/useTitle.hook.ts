
import { MutableRefObject, useEffect, useRef } from "react";

export const useTitle: (title: string) => void = (title: string): void => {
  const defaultTitle: MutableRefObject<string> = useRef<string>(document.title);

  useEffect((): void => {
    // TODO: move name to config/env file
    document.title = `${title} | Scania Coder`;
  }, [title]);

  useEffect((): (() => void) => {
    return ((): void => {
      document.title = defaultTitle.current;
    });
  }, []);
};