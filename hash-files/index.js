const core = require("@actions/core");
const exec = require("@actions/exec");
const path = require("path");
const fs = require("fs");

const checkBin = require("../util/bin");
const projectDirectory = core.getInput("project_directory");

const verbose = core.getBooleanInput("verbose");
const skipBuild = core.getBooleanInput("skipBuild");

checkBin("fastly", "version")
  .then(async () => {
    let params = ["compute", "hash-files", "--non-interactive"];
    if (verbose) params.push("--verbose");
    if (skipBuild) params.push("--skip-build");

    const result = await exec.getExecOutput("fastly", params, {
      cwd: core.getInput("project_directory"),
    });

    fs.writeFileSync(
      path.join(projectDirectory, "pkg", "hash.txt"),
      result.stdout
    );

    return result;
  })
  .catch((err) => {
    core.setFailed(err.message);
  });
