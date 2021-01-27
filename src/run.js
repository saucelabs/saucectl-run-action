const core = require("@actions/core");
const fs = require('fs');
const { promisify } = require("util");

const lstat = promisify(fs.lstat)

async function saucectlRun({ workingDirectory }) {
    if (workingDirectory) {
        const stats = await lstat(workingDirectory);
        if (!stats.isDirectory()) {
            core.setFailed(`${workingDirectory} does not exists.`);
            return false;
        }
        process.chdir(workingDirectory);
    }
    core.info("Launching saucectl !");
    return true;
};

module.exports = { saucectlRun };