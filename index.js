#!/usr/bin/env node

const fs = require("fs");
const xcode = require("xcode");
const path = require("path");
const copyFiles = require("./copyFiles");

function getPackageJsonPath() {
	return path.resolve(process.cwd(), "package.json");
}

function getPackageJsonContent(packageJsonPath) {
	return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
}

function getDestinationDebPath() {
	return path.resolve(process.cwd(), "deb");
}

async function copyDebDirectory() {
	const sourceDebPath = path.resolve(__dirname, "deb");
	const destinationDebPath = getDestinationDebPath();
	await copyFiles(sourceDebPath, destinationDebPath);
}

// function renameContent(projectName) {
// 	const destinationDebPath = getDestinationDebPath();
// 	const entitlementFilePath = path.join(
// 		destinationDebPath,
// 		"template.entitlements"
// 	);
// 	const entitlementNewFilePath = path.join(
// 		destinationDebPath,
// 		`${projectName}.entitlements`
// 	);
// 	fs.renameSync(entitlementFilePath, entitlementNewFilePath);
// }

function removeXcodeCodeSigning(projectPath) {
	return new Promise((resolve, reject) => {
		const project = xcode.project(projectPath);
		project.parse(function(error) {
			if (error) {
				reject(error);
				return;
			}
			const options = {
				shellPath: "/bin/sh",
				shellScript: "../deb/postBuildScript.sh\n"
			};
			const buildPhase = project.addBuildPhase(
				[],
				"PBXShellScriptBuildPhase",
				"Run a script",
				project.getFirstTarget().uuid,
				options
			).buildPhase;
			project.addBuildProperty("CODE_SIGNING_ALLOWED", "NO");
			project.addBuildProperty("CODE_SIGNING_REQUIRED", "NO");
			fs.writeFileSync(projectPath, project.writeSync());
			resolve();
		});
	});
}

function addScriptCommands(packageJsonPath, packageJsonContent) {
	packageJsonContent.scripts = packageJsonContent.scripts || {};
	packageJsonContent.scripts["build"] =
		"react-native run-ios --configuration=release --device";
	packageJsonContent.scripts["deploy-deb"] = "./deb/deploy.sh";

	fs.writeFileSync(
		packageJsonPath,
		JSON.stringify(packageJsonContent, null, 2)
	);
}

(async () => {
	try {
		const packageJsonPath = getPackageJsonPath();
		const packageJsonContent = getPackageJsonContent(packageJsonPath);
		const projectName = packageJsonContent.name;

		await removeXcodeCodeSigning(
			path.resolve(
				process.cwd(),
				"ios",
				`${projectName}.xcodeproj`,
				"project.pbxproj"
			)
		);

		addScriptCommands(packageJsonPath, packageJsonContent);
		await copyDebDirectory();

		// TODO: add post build to pbx proj

		console.log("Done");
	} catch (e) {
		console.log(e);
	}
})();
