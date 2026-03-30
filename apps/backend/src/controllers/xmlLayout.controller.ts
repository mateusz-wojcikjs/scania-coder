import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { XmlLayoutService } from "../services/xmlLayout.service";

export const createLayout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { layoutName, updates } = request.body;
    const userId: number = response.locals.user.userId;
    const savedLayout = await XmlLayoutService.createLayout(userId, layoutName, updates);

    response.status(201).json(savedLayout);
  } catch (error) {
    logger.error("Error during createLayout()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const getLayoutById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const userId: number = response.locals.user.userId;
    
    const layout = await XmlLayoutService.getLayoutById(Number(id), userId);
    if (!layout) {
      return response.status(404).json({ error: "Layout not found" });
    }
    response.status(200).json(layout);
  } catch (error) {
    logger.error("Error during getLayoutById()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const getLayouts = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId: number = response.locals.user.userId;
    const layouts = await XmlLayoutService.getAllLayouts(userId);
    response.status(200).json(layouts);
  } catch (error) {
    logger.error("Error during getLayouts()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const updateLayout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const { name, updates } = request.body;
    const userId: number = response.locals.user.userId;
    const layoutId = Number(id);

    if (isNaN(layoutId)) {
      return response.status(400).json({ error: "Invalid layout ID" });
    }

    const updated = await XmlLayoutService.updateLayout(layoutId, userId, name, updates);
    if (!updated) {
      return response.status(404).json({ error: "Layout not found" });
    }

    response.status(200).json(updated);
  } catch (error) {
    logger.error("Error during updateLayout()", {
      error,
      requestBody: request.body,
    });
    next(error);
  }
};

export const deleteLayout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params;
    const userId: number = response.locals.user.userId;

    const layoutId = Number(id);
    if (isNaN(layoutId)) {
      return response.status(400).json({ error: "Invalid layout ID" });
    }

    const layout = await XmlLayoutService.getLayoutById(layoutId, userId);
    if (!layout) {
      return response.status(404).json({ error: "Layout not found" });
    }

    await XmlLayoutService.deleteLayoutById(layoutId, userId);

    response.status(200).json({ message: "Layout deleted successfully" });
  } catch (error) {
    logger.error("Error during deleteLayout()", {
      error,
      requestParams: request.params,
    });
    next(error);
  }
};
