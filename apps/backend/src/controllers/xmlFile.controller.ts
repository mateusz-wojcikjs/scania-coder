import { XmlFileMetaData } from "@scania-coder/types";
import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { XmlFileService } from "../services/xmlFile.service";

export const getXmlMetadata = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file: Express.Multer.File | undefined = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const xmlData: string = file.buffer.toString("utf-8");
        const metadata: XmlFileMetaData = await XmlFileService.extractMetaData(xmlData);

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
        const { updates, newMajorVersion } = request.body;
        const file = request.file;
        const parsedUpdates = JSON.parse(updates);

        if (!newMajorVersion) {
            return response.status(400).json({ error: "No file version provided." });
        }

        if (!file) {
            return response.status(400).json({ error: "No file uploaded." });
        }

        if (!parsedUpdates || !Array.isArray(parsedUpdates)) {
            return response.status(400).json({ error: "Updates must be provided as an array." });
        }

        const xmlData: string = file.buffer.toString("utf-8");
        const { updatedXml, updatedFields, errors } = await XmlFileService.editXmlFile(xmlData, parsedUpdates, newMajorVersion);

        if (errors.length > 0) {
            return response.status(400).json({
                error: "Some fields could not be updated.",
                errors,
                updatedFields,
            });
        }

        response.setHeader("Content-Type", "application/xml");
        response.send(updatedXml);

    } catch (error) {
        logger.error("Error during editXml()", {
            error,
            requestBody: request.body,
        });
        next(error);
    }
};
