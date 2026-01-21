import { UseDate } from "../interfaces";

export const useDate: () => UseDate = (): UseDate => {
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleString("pl-PL", {
      timeZone: "Europe/Warsaw",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return { formatDate };
};