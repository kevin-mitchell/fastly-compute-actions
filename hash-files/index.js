const core = require("@actions/core");
const exec = require("@actions/exec");

const checkBin = require("../util/bin");

const verbose = core.getBooleanInput("verbose");
const skipBuild = core.getBooleanInput("skipBuild");

checkBin("fastly", "version")
  .then(() => {
    let params = ["compute", "hash-files", "--non-interactive"];
    if (verbose) params.push("--verbose");
    if (skipBuild) params.push("--skip-build");

    return exec.exec("fastly", params, {
      cwd: core.getInput("project_directory"),
    });
  })
  .catch((err) => {
    core.setFailed(err.message);
  });
