import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums";
import { logger } from "../logger";
import { UserService } from "../services/user.service";

const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasMinLength && hasUpperCase && hasNumber;
};

export const getUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called getUsers()");
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;
    const sortBy = (request.query.sortBy as string) || "createdAt";
    const sortOrder = (request.query.sortOrder as string)?.toUpperCase() as "ASC" | "DESC" || "DESC";

    const filters = {
      username: request.query.username as string,
      email: request.query.email as string,
      role: request.query.role as UserRole,
    };

    if (page < 1 || limit < 1) {
      return response.status(400).json({ message: "Page and limit must be positive numbers" });
    }

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return response.status(400).json({ message: "Invalid sortOrder. Use 'ASC' or 'DESC'" });
    }

    const data = await UserService.getUsers(page, limit, sortBy, sortOrder, filters);
    response.status(200).json(data);
  }  catch (error) {
    logger.error("Error during getUsers()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const getUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called getUser()");
    const { id } = request.params;
    const user = await UserService.getUser(Number(id));

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    response.status(200).json(user);
  } catch (error) {
      logger.error("Error during getUser()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const createUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called createUser()");
    const { email, role, username } = request.body;

    if (!email) {
      throw "Could not extract the email from the request, aborting.";
    }

    const user = await UserService.createUser(username, email, role);
    logger.info(`User ${user.email} has been created.`);

    response.status(201).json(user);
  } catch (error) {
      logger.error("Error during createUser()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called updateUser()");
    const { id } = request.params;
    const { password, role, username } = request.body;

    if (password && !validatePassword(password)) {
      return response.status(400).json({ 
        message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number" 
      });
    }

    const updatedUser = await UserService.updateUser(Number(id), { password, role, username });
    logger.info(`User ${updatedUser?.email} has been updated.`);

    response.status(200).json(updatedUser);
  } catch (error) {
      logger.error("Error during updateUser()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called deleteUser()");
    const { id } = request.params;
    const userId: number = Number(id);

    if (isNaN(userId)) {
      return response.status(400).json({ error: "Invalid userId" });
    }

    await UserService.deleteUserById(userId);
    response.status(200).json({ message: "User deleted successfully" });
  }  catch (error) {
    logger.error("Error during deleteUser()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const toggleUserActiveStatus = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called toggleUserActiveStatus()");
    const { id } = request.params;
    const userId: number = Number(id);

    if (isNaN(userId)) {
      return response.status(400).json({ error: "Invalid userId" });
    }

    const user = await UserService.toggleUserActiveStatus(userId);
    logger.info(`User ${user.email} active status toggled to ${user.isActive}`);

    response.status(200).json(user);
  } catch (error) {
    logger.error("Error during toggleUserActiveStatus()", {
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

    const user = await UserService.resendInvitation(email);
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

export const getInvitationStatus = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called getInvitationStatus()");
    const { email } = request.query;

    if (!email || typeof email !== "string") {
      return response.status(400).json({ error: "Email query parameter is required" });
    }

    const status = await UserService.getInvitationStatus(email);
    logger.info(`Invitation status checked for ${email}: ${status.status}`);

    response.status(200).json(status);
  } catch (error) {
    logger.error("Error during getInvitationStatus()", {
      error,
      requestQuery: request.query,
    });
    next(error);
  }
};

export const deactivateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    logger.debug("Called deactivateUser()");
    const { id } = request.params;
    const userId: number = Number(id);

    if (isNaN(userId)) {
      return response.status(400).json({ error: "Invalid userId" });
    }

    const user = await UserService.deactivateUser(userId);
    logger.info(`User ${user.email} has been deactivated`);

    response.status(200).json(user);
  } catch (error) {
    logger.error("Error during deactivateUser()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

