import dotenv, { DotenvConfigOutput } from "dotenv";

const result: DotenvConfigOutput = dotenv.config();

if (result.error) {
    console.log("Error loading environment variables, aborting.");
    process.exit(1);
}

import express, { Express } from "express";
import cors from "cors";

import { login } from "./controllers/login.controller";
import { AppDataSource } from "./data-source";
import { defaultErrorHandler } from "./default-error-handler";
import { logger } from "./logger";
import { isAuthenticated } from "./middlewares";
import { root } from "./routes/root";
import usersRoute from "./routes/users.route";
import xmlFileRoute from "./routes/xmlFile.route";
import xmlLayoutRoute from "./routes/xmlLayout.route";

const app: Express = express();

const setupExpress = (): void => {

    app.use(cors({ origin: true }));

    app.use(express.json());

    app.route("/api").get(root);
    app.route("/api/login").post(login);

    app.use("/api", isAuthenticated ,xmlFileRoute);
    app.use("/api", isAuthenticated, xmlLayoutRoute);
    app.use("/api", isAuthenticated, usersRoute);

    app.use(defaultErrorHandler);
};

const startServer = (): void => {
    const port: string = process.env.PORT || "3000";

    app.listen(port, (): void => {
        logger.info(`HTTP REST API Server is now running at http://localhost:${port}`);
    });
};

AppDataSource.initialize()
    .then(() => {
        logger.info("The datasource has been initialized successfully");
        setupExpress();
        startServer();
    })
    .catch((err) => {
        logger.error(`Error during initialization: ${err}`, err);
        process.exit(1);
    });
