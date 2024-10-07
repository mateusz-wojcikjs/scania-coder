import path from "node:path";
import { DataSource } from "typeorm";

export const AppDataSource: DataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, "/../**/**.entity.ts")],
    ssl: false,
    synchronize: true,
    logging: true,
});
