const { readdirSync, statSync } = require("fs"); // Do NOT convert to an `import` statement for Wallaby.js to work!

function findJestConfigFiles() {
  const packageDirectoryPath = "./packages";
  const packageDirectories = readdirSync(packageDirectoryPath);
  const possibleExtensions = ["js", "ts", "json", "mjs", "cjs"];

  return packageDirectories
    .map((packageDirectory) => {
      const possibleFilePaths = possibleExtensions.map(
        (extension) =>
          `${packageDirectoryPath}/${packageDirectory}/jest.config.${extension}`
      );
      const foundFilePath = (function statPossibleFilePaths() {
        for (const filePath of possibleFilePaths) {
          try {
            statSync(filePath);
            return filePath;
          } catch (e) {}
        }
      })();
      return foundFilePath;
    })
    .filter((foundFilesPath) => !!foundFilesPath);
}

const projects = findJestConfigFiles();

module.exports = { projects };
