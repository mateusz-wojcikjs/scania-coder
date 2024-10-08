
import * as dotenv from "dotenv";

const result = dotenv.config();

import "reflect-metadata";

import { AppDataSource } from "./data-source";
import { LAYOUTS, USERS } from "./db-data";
import { User,Layout } from "./entity";
import { calculatePasswordHash } from "./utils";

async function populateDb() {
    await AppDataSource.initialize();

    console.log("Database connection ready.");

    const users = Object.values(USERS) as any[];

    const layouts = Object.values(LAYOUTS) as any[];

    const layoutRepository = AppDataSource.getRepository(Layout);

    for (const userData of users) {
        console.log(`Inserting user: ${userData}`);

        const { email, username, role, passwordSalt, plainTextPassword } = userData;

        const user = AppDataSource
            .getRepository(User)
            .create({
                email,
                username,
                role,
                passwordSalt,
                password: await calculatePasswordHash(plainTextPassword, passwordSalt),
            });

        await AppDataSource.manager.save(user);
    }

  for (const layoutData of layouts) {
    console.log(`Inserting layout: ${layoutData.name}`);

    const layout = layoutRepository.create(layoutData);
    await layoutRepository.save(layout);
  }
}

populateDb()
    .then(() => {
        console.log("Finished populating database, exiting!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error populating database,", err);
    });
