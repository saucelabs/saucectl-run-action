const core = require("@actions/core");
const github = require("@actions/github");
const semver = require('semver');
const childProcess = require("child_process");
const tc = require('@actions/tool-cache');
const { installSaucelabs } = require("./installer");
const {} = require("./executer");

async function run() {
    const versionSpec = core.getInput('saucectl-version');
    if (!semver.valid(versionSpec)) {
        core.setFailed("Invalid version format");
    }
    await installSaucelabs({ versionSpec });

    const child = childProcess.spawn('saucectl', ['--version']);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('exit', (exitCode) => {
        process.exit(exitCode);
    });
}

run();