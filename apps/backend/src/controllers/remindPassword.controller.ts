import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AuthService } from "../services";

export const remindPassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
        logger.debug("Called remindPassword()");

        const { email } = request.body;
        await AuthService.remindPassword(email);

        response.status(200).json({ message: "If the email exists, a password reset link has been sent." });
    } catch (error) {
        logger.error("Error during remindPassword", {
            error,
            requestBody: request.body,
        });
        next(error);
    }
};

