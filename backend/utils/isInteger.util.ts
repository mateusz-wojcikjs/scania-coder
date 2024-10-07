export const isInteger: (input: string) => RegExpMatchArray | boolean = (input: string) => input?.match(/^\d+$/) ?? false;
