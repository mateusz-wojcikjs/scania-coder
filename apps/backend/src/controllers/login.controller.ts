import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AuthService } from "../services";

export const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        logger.debug("Called login()");

        const { email, password } = request.body;
        const authResult = await AuthService.login(email, password);

        response.status(200).json(authResult);
    } catch (error) {
        logger.error("Error during login", {
            error,
            requestBody: request.body,
        });
        next(error);
    }
};
