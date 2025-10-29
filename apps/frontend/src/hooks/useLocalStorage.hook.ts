import { useEffect, useState } from "react";

export type UseLocalStorage<T = string> = [
 storedValue: T,
 setValue: (value: T) => void,
];

export const useLocalStorage: <T = string>(key: string, initialValue: T) => UseLocalStorage<T> = <T = string>(key: string, initialValue: T): UseLocalStorage<T> => {
  const readValue: () => T = (): T => {
    const item: string = localStorage.getItem(key) || "";
    return item !== null ? (JSON.parse(item) as T) : initialValue;
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: (value: T) => void = (value: T): void => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  useEffect((): () => void => {
    const handleStorageChange: () => void = (): void => {
      setStoredValue(readValue());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return (): void => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
};