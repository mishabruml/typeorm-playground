import { Plugin } from "esbuild";
import tinyGlob from "tiny-glob";

export const additionalEntrypointsGlobPlugin = ({
	additionalEntrypoints,
}: {
	additionalEntrypoints: string[];
}) => {
	const plugin: Plugin = {
		name: "additionalGlobEntrypoints",
		async setup(build) {
			const initialEntrypoints = build.initialOptions.entryPoints;
			if (!Array.isArray(initialEntrypoints)) {
				throw new TypeError(
					"additionalGlobEntrypoints plugin currently only supports array entrypoints"
				);
			}

			if (
				!Array.isArray(additionalEntrypoints) ||
				!additionalEntrypoints.every((s) => typeof s === "string")
			) {
				throw new TypeError(
					`additionalEntrypoints must be an array of strings. Recieved ${additionalEntrypoints}`
				);
			}

			console.info(
				`Resolving additionalEntrypoints [ ${additionalEntrypoints
					.map((s) => `'${s}'`)
					.join(",")} ]`
			);

			const resolvedAdditionalEntrypoints = (
				await Promise.all(additionalEntrypoints.map((str) => tinyGlob(str)))
			).flat();

			console.info(
				`Resolved additional files [ ${resolvedAdditionalEntrypoints
					.map((s) => `'${s}'`)
					.join(",")} ] from additional entrypoints`
			);

			build.initialOptions.entryPoints = [
				...initialEntrypoints,
				...resolvedAdditionalEntrypoints,
			];
		},
	};
	return plugin;
};
