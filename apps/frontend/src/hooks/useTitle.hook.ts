import { MutableRefObject, useEffect, useRef } from "react";

const appName = import.meta.env.VITE_APP_NAME;

export const useTitle: (title: string) => void = (title: string): void => {
  const defaultTitle: MutableRefObject<string> = useRef<string>(document.title);

  useEffect((): void => {
    document.title = `${title} | ${appName}`;
  }, [title]);

  useEffect((): (() => void) => {
    const originalTitle = defaultTitle.current;
    return ((): void => {
      document.title = originalTitle;
    });
  }, []);
};