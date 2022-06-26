const {
	additionalEntrypointsGlobPlugin,
} = require("./additionalEntrypointsGlobPlugin");

module.exports = [
	additionalEntrypointsGlobPlugin({
		additionalEntrypoints: ["src/handlers/migrations/*.ts"],
	}),
];
