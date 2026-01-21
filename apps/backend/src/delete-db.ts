
import * as dotenv from "dotenv";

dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Layout, User } from "./entity";

async function deleteDb() {
    await AppDataSource.initialize();

    console.log("Database connection ready.");

    console.log("Clearing USERS table.");
    await AppDataSource.getRepository(User).delete({});

    console.log("Clearing LAYOUTS table.");
    await AppDataSource.getRepository(Layout).delete({});

}


deleteDb()
    .then(() => {
        console.log("Finished deleting database, exiting!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error deleting database,", err);
    });
