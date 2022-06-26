import { dataSource } from "../datasource";

export const handler = async () => {
	await dataSource.initialize();
	await dataSource.runMigrations();
	await dataSource.destroy();
};
