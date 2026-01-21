import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { InvitationService } from "../services";

const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasMinLength && hasUpperCase && hasNumber;
};

export const setupPassword = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called setupPassword()");
    const { token, password } = request.body;

    if (!token || !password) {
      return response.status(400).json({ message: "Token and password are required" });
    }

    if (!validatePassword(password)) {
      return response.status(400).json({ 
        message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number" 
      });
    }

    const authResult = await InvitationService.setupPassword(token, password);
    logger.info(`Password has been set for user ${authResult.user.email}`);

    response.status(200).json(authResult);
  } catch (error) {
    logger.error("Error during setupPassword()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const cancelInvitation = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called cancelInvitation()");
    const { id } = request.params;
    const userId: number = Number(id);

    if (isNaN(userId)) {
      return response.status(400).json({ error: "Invalid userId" });
    }

    const user = await InvitationService.cancelInvitation(userId);
    logger.info(`Invitation cancelled for userId ${userId}`);

    response.status(200).json(user);
  } catch (error) {
    logger.error("Error during cancelInvitation()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const resendInvitation = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called resendInvitation()");
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({ error: "Email is required" });
    }

    const user = await InvitationService.resendInvitation(email);
    logger.info(`Invitation resent to user ${user.email}`);

    response.status(200).json({ message: "Invitation resent successfully", user });
  } catch (error) {
    logger.error("Error during resendInvitation()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};