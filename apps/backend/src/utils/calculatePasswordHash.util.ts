import crypto from "crypto";
import util from "util";

const hashPassword = util.promisify(crypto.pbkdf2);

export const calculatePasswordHash = async (
    plainTextPassword: string,
    passwordSalt: string,
    iterations = 1000,
    keyLength = 64,
) => {
    const passwordHash = await hashPassword(
        plainTextPassword,
        passwordSalt,
        iterations,
        keyLength,
        "sha512"
    );
    return passwordHash.toString("hex");
};
