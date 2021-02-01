
const core = require("@actions/core");

async function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), duration * 1000);
    });
}

async function awaitExecution(child) {
    return new Promise(async (resolve) => {
        let exited = false;
        let lastOutput = new Date().getTime();

        // Log lastime a console operation has been made
        child.stdout.on('data', (data) => {
            lastOutput = new Date().getTime();
            process.stdout.write(data);
        });
        child.stderr.on('data', (data) => {
            lastOutput = new Date().getTime();
            process.stderr.write(data);
        });

        // Log when child actually has exited
        child.on('exit', (exitCode) => {
            exited = true;
            resolve(exitCode);
        });

        // Enhanced timeout security: Wait for the process to exit, or no output for 2 minutes.
        // Saucectl is expected to output one . per second, so this is quite conservative to keep
        // this thereshold at 2 minutes.
        while (!exited) {
            const currentTime = new Date().getTime();
            const twoMinutes = 2 * 60 * 1000;
            if (currentTime - lastOutput > twoMinutes) {
                core.error("saucectl: timed-out");
                resolve(-1);
            }
            await sleep(1);
        }
    });
}

module.exports = { awaitExecution };