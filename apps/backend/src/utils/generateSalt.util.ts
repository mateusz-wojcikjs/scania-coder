import * as crypto from "crypto";

export const generateSalt: (size?: number) => string = (size = 16): string => {
    return crypto.randomBytes(size).toString("hex");
};
