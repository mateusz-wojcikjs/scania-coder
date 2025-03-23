import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums";
import { logger } from "../logger";
import { UserService } from "../services/user.service";

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
    const { email, password, role, username } = request.body;

    if (!email) {
      throw "Could not extract the email from the request, aborting.";
    }

    if (!password) {
      throw "Could not extract the plain text password from the request, aborting.";
    }

    const user = await UserService.createUser(email, username, password, role);
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
    const { id, password, role, username } = request.body;

    const updatedUser = await UserService.updateUser(Number(id), { password, role, username });
    logger.info(`User ${updatedUser?.email} has been created.`);

    response.status(201).json(updatedUser);
  } catch (error) {
      logger.error("Error during createUser()", {
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
