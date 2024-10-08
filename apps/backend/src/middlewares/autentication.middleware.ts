import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../logger";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export const isAuthenticated = (request: Request, response: Response, next: NextFunction) => {
    const authJwtToken = request.headers.authorization;

    if (!authJwtToken) {
        logger.info("The authentication JWT is not present, access denied.");
        response.status(403).send({ message: "Access denied. No authentication token provided." });
        return;
    }

    checkJwtValidity(authJwtToken)
        .then(user => {
            logger.info("Authentication JWT successfully decoded:", user);
            response.locals.user = user;

            next();
        })
        .catch(error => {
            logger.error("Could not validate the authentication JWT, access denied.", error);
            response.status(403).send({ message: "Access denied. Invalid authentication token." });
        });
};

const checkJwtValidity = async (authJwtToken: string) => {
    const user = await jwt.verify(authJwtToken, JWT_SECRET);

    logger.info("Found user details in JWT:", user);

    return user;
};
