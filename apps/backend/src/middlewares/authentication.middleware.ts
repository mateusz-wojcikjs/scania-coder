import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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

        const user = await checkJwtValidity(authJwtToken);

        logger.info("Authentication JWT successfully decoded:", user);
        response.locals.user = user;

        next();
    } catch (error) {
        logger.error("Could not validate the authentication JWT, access denied.", error);
        response.status(403).json({ message: "Access denied. Invalid authentication token." });
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
