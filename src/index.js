const core = require("@actions/core");
const childProcess = require("child_process");
const { saucectlInstall } = require("./install");
const { saucectlRun } = require("./run");
const { awaitExecution } = require("./helpers");

const config = require("./config");

async function run() {
    const cfg = config.get();
    if (!cfg) {
        core.setFailed("Invalid configuration.");
        return;
    }

    // Install saucectl
    if (!await saucectlInstall({ versionSpec: cfg.saucectlVersion })) {
        return;
    }

    // Run it to confirm version
    const child = childProcess.spawn('saucectl', ['--version']);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    const exitCode = await awaitExecution(child);
    core.info(`ExitCode: ${exitCode}`);

    console.log(cfg);

    // Really execute saucectl
    if (!cfg.skipRun) {
        if (!await saucectlRun(cfg)) {
            return;
        }
    }
}

if (require.main === module) {
    run();
}