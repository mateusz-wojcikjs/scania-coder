import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { XmlFileService } from "../services/xmlFile.service";

export const getXmlMetadata = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const xmlData = file.buffer.toString("utf-8");
        const metadata = await XmlFileService.extractMetaData(xmlData);

        res.status(200).json(metadata);
    } catch (error) {
        logger.error("Error during getXmlMetadata()", {
            error,
            requestBody: req.body,
        });
        next(error);
    }
};

export const editXml = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { updates } = request.body;
        const file = request.file;
        const parsedUpdates = JSON.parse(updates);

        if (!file) {
            return response.status(400).json({ error: "No file uploaded" });
        }

        if (!parsedUpdates || !Array.isArray(parsedUpdates)) {
            return response.status(400).json({ error: "Updates must be provided as an array." });
        }

        const xmlData = file.buffer.toString("utf-8");
        const updatedXml = await XmlFileService.editXmlFile(xmlData, parsedUpdates);

        response.setHeader("Content-Type", "application/xml");
        response.send(updatedXml);

    } catch (error) {
        logger.error("Error during getXmlMetadata()", {
            error,
            requestBody: request.body,
        });
        next(error);
    }
};
