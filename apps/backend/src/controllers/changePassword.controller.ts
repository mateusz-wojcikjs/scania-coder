import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { AuthService } from "../services";

const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasMinLength && hasUpperCase && hasNumber;
};

export const changePassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
        logger.debug("Called changePassword()");

        const user = response.locals.user;
        if (!user || !user.userId) {
            return response.status(401).json({ message: "Authentication required" });
        }

        const { password } = request.body;

        if (!password) {
            return response.status(400).json({ message: "Password is required" });
        }

        if (!validatePassword(password)) {
            return response.status(400).json({ 
                message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number" 
            });
        }

        await AuthService.changePassword(user.userId, password);
        logger.info(`Password has been changed for user ${user.email}`);

        response.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        logger.error("Error during changePassword", {
            error,
            requestBody: request.body,
        });
        next(error);
    }
};
