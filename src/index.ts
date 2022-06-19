import { Example } from "../src/entities/index";
import { DataSource } from "typeorm";

(async () => {
	const dataSource = new DataSource({
		type: "postgres",
		host: "localhost",
		port: 55000,
		username: "postgres",
		password: "postgrespw",
		database: "postgres",
		entities: [Example],
		synchronize: true,
		logging: false,
		entitySkipConstructor: true,
	});
	await dataSource.initialize();
	const myExample = new Example({ name: "misha" });
	await myExample.save();
})();
