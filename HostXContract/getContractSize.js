const fs = require("fs");
const path = require("path");

const contractNames = ["EventManagerFactory", "EventContract"]; // Add your contract names here

contractNames.forEach((contract) => {
  const artifactPath = path.join(
    __dirname,
    "artifacts/contracts",
    `${contract}.sol`,
    `${contract}.json`
  );

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const bytecode = artifact.deployedBytecode || artifact.bytecode;

    const sizeInBytes = bytecode.length / 2;
    console.log(`${contract}: ${sizeInBytes} bytes`);
  } else {
    console.log(`Artifact for ${contract} not found.`);
  }
});
