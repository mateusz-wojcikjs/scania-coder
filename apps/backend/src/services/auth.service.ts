import { LoginResponse } from "@scania-coder/types";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { ErrorCodes, UserRole } from "../enums";
import { BadRequestError, UnauthorizedError } from "../errors";
import { calculatePasswordHash } from "../utils";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export class AuthService {
    static async login(email: string, password: string): Promise<LoginResponse> {
        if (!email || !password) {
            throw new BadRequestError(ErrorCodes.ERR_EMAIL_PASSWORD_REQUIRED);
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedError(ErrorCodes.ERR_INVALID_CREDENTIALS);
        }

        const passwordHash = await calculatePasswordHash(password, user.passwordSalt);

        if (passwordHash !== user.password) {
            throw new UnauthorizedError(ErrorCodes.ERR_INVALID_CREDENTIALS);
        }

        const authJwt = {
            userId: user.id,
            email: user.email,
            isAdmin: user.role === UserRole.ADMIN,
        };

        const authJwtToken = jwt.sign(authJwt, JWT_SECRET);

        return {
            user: {
                email: user.email,
                name: user.username,
                isAdmin: user.role === UserRole.ADMIN
            },
            authJwtToken,
        };
    }
}
