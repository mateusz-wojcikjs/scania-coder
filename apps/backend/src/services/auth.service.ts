import { LoginResponse } from "@scania-coder/types";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { ErrorCodes, UserRole } from "../enums";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import { EmailService } from "./email.service";
import { calculatePasswordHash, generateSalt } from "../utils";

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
            tokenVersion: user.tokenVersion,
        };

        const authJwtToken = jwt.sign(authJwt, JWT_SECRET);

        return {
            user: {
                id: user.id.toString(),
                email: user.email,
                username: user.username,
                isAdmin: user.role === UserRole.ADMIN
            },
            authJwtToken,
        };
    }

    static async remindPassword(email: string): Promise<void> {
        if (!email) {
            throw new BadRequestError(ErrorCodes.ERR_EMAIL_REQUIRED);
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { email } });
        
        if (!user) {
            return;
        }

        const passwordResetToken = generateSalt(32);
        const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
        
        user.passwordResetToken = passwordResetToken;
        user.passwordResetExpires = passwordResetExpires;

        await userRepo.save(user);

        await EmailService.sendPasswordResetEmail({
            to: user.email,
            token: passwordResetToken,
            name: user.username,
        });
    }

    static async changePassword(userId: number, password: string): Promise<void> {
        if (!password) {
            throw new BadRequestError(ErrorCodes.ERR_EMAIL_PASSWORD_REQUIRED);
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundError(ErrorCodes.ERR_USER_NOT_FOUND);
        }

        const passwordSalt = generateSalt(64);
        const passwordHash = await calculatePasswordHash(password, passwordSalt);

        user.password = passwordHash;
        user.passwordSalt = passwordSalt;

        await userRepo.save(user);
    }
}
