import { FPC } from "../types";

export const findInsertionIndex: (name: string, records: FPC[]) => number = (name: string, records: FPC[]): number => {
  for (let i = 0; i < records.length; i++) {
    if (Number(records[i].$.Name) > Number(name)) {
      return i;
    }
  }
  return records.length;
};
