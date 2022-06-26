import path from "path";
import { DataSource } from "typeorm";
import { Example } from "./entities";

const useTsMigrations = Boolean(process.env["USE_TS_MIGRATIONS"]); // change this to true be able to run TS typeorm migrations via CLI, false

const migrationsDir = useTsMigrations
	? path.resolve(process.cwd(), "src/handlers/migrations/*.ts")
	: path.resolve(__dirname, "migrations/*.js");

export const dataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 55001,
	username: "postgres",
	password: "postgrespw",
	database: "postgres",
	entities: [Example],
	migrations: [migrationsDir],
	synchronize: false,
	logging: true,
	entitySkipConstructor: true,
});
