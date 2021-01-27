const core = require("@actions/core");
const github = require("@actions/github");
const childProcess = require("child_process");
const tc = require('@actions/tool-cache');
const { installSaucelabs } = require("./installer");

const config = require("./config");

async function run() {
    const cfg = config.get();
    await installSaucelabs(cfg.saucectlVersion);

    const child = childProcess.spawn('saucectl', ['--version']);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('exit', (exitCode) => {
        process.exit(exitCode);
    });
}

run();