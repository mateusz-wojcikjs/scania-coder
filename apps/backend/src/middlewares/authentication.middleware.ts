import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { UserRole } from "../enums";
import { logger } from "../logger";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export const isAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.info("The authentication JWT is not present or invalid, access denied.");
            return response.status(403).json({ message: "Access denied. No authentication token provided." });
        }

        const authJwtToken = authHeader.substring(7);
        const jwtUser = await checkJwtValidity(authJwtToken);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: (jwtUser as any).userId } });

        if (!user || !user.isActive) {
            logger.info(`User ${(jwtUser as any).email} is not active or not found, access denied.`);
            return response.status(403).json({ message: "Access denied. User account is inactive." });
        }

        logger.info("Authentication JWT successfully decoded:", jwtUser);
        response.locals.user = jwtUser;

        next();
    } catch (error) {
        logger.error("Could not validate the authentication JWT, access denied.", error);
        response.status(403).json({ message: "Access denied. Invalid authentication token." });
    }
};

export const requireAdmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = response.locals.user;

        if (!user) {
            logger.info("No user found in request context, access denied.");
            return response.status(401).json({ message: "Access denied. Authentication required." });
        }

        if (!user.isAdmin) {
            logger.info(`User ${user.email} with isAdmin=${user.isAdmin} attempted to access admin-only resource, access denied.`);
            return response.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        logger.info(`Admin access granted to user ${user.email}`);
        next();
    } catch (error) {
        logger.error("Error during admin authorization check:", error);
        response.status(403).json({ message: "Access denied. Authorization check failed." });
    }
};

const checkJwtValidity = async (authJwtToken: string) => {
    try {
        const user = jwt.verify(authJwtToken, JWT_SECRET);
        logger.info("Found user details in JWT:", user);
        return user;
    } catch (error) {
        logger.error("JWT verification failed:", error);
        throw error;
    }
};
