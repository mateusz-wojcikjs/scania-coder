import { useCallback, useEffect, useState } from "react";

export type UseLocalStorage<T = string> = [
 storedValue: T,
 setValue: (value: T) => void,
];

export const useLocalStorage: <T = string>(key: string, initialValue: T) => UseLocalStorage<T> = <T = string>(key: string, initialValue: T): UseLocalStorage<T> => {
  const readValue: () => T = useCallback((): T => {
    const item: string | null = localStorage.getItem(key);
    if (item === null || item === "" || item.trim() === "") {
      return initialValue;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      localStorage.removeItem(key);
      return initialValue;
    }
  }, [key, initialValue]);
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
  }, [readValue]);

  return [storedValue, setValue];
};