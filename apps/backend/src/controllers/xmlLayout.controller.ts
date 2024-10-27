import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { XmlLayoutService } from "../services/xmlLayout.service";

export const createLayout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { layoutName, updates } = request.body;
    // TODO: apply userId when frontend implementation will be ready
    // const userId: number = response.locals.user.userId
    const userId: number = 1;

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
    // TODO: Handle id type; apply types
    const layout = await XmlLayoutService.getLayoutById(Number(id));
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
    const layouts = await XmlLayoutService.getAllLayouts();
    response.status(200).json(layouts);
  } catch (error) {
    logger.error("Error during getLayouts()", {
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

    const layoutId = Number(id);
    if (isNaN(layoutId)) {
      return response.status(400).json({ error: "Invalid layout ID" });
    }

    const layout = await XmlLayoutService.getLayoutById(layoutId);
    if (!layout) {
      return response.status(404).json({ error: "Layout not found" });
    }

    await XmlLayoutService.deleteLayoutById(layoutId);

    response.status(200).json({ message: "Layout deleted successfully" });
  } catch (error) {
    logger.error("Error during deleteLayout()", {
      error,
      requestParams: request.params,
    });
    next(error);
  }
};
