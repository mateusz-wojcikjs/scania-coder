import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "./enums";
import { CustomError } from "./errors";
import { logger } from "./logger";

const isDevelopment = process.env.NODE_ENV !== "production";

export function defaultErrorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    const errorCode = err instanceof CustomError ? err.errorCode : ErrorCodes.ERR_UNEXPECTED_ERROR;
    const message = err.message || "Internal Server Error";

    logger.error(`Default error handler triggered; statusCode: ${statusCode}, errorCode: ${errorCode}, message: ${message}`, {
        ...(isDevelopment && { stack: err.stack }),
        errorCode,
        statusCode,
    });

    if (res.headersSent) {
        logger.error("Response headers already sent. Delegating to built-in Express error handler.");
        return next(err);
    }

    res.status(statusCode).json({
        error: {
            errorCode,
            message,
            statusCode,
        },
    });
}
