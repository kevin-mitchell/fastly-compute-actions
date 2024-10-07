const core = require("@actions/core");
const exec = require("@actions/exec");
const glob = require("@actions/glob");
const path = require("path");

const checkBin = require("../util/bin");

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

    console.log(result);

    return exec.exec(`echo "${result.stdout}" > pkg/hash.txt`, [], {});
  })
  .catch((err) => {
    core.setFailed(err.message);
  });
