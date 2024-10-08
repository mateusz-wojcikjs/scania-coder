import { Request, Response } from "express";

export const root = (request: Request, response: Response) => {
    response.status(200).send("<h1>test</h1>");
};
