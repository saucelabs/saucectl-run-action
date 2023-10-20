const core = require('@actions/core');

function awaitExecution(child) {
  return new Promise((resolve) => {
    let exited = false;
    let lastOutput = new Date().getTime();

    // Log the last time a console operation has been made
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
    // this threshold at 2 minutes.
    const twoMinutes = 2 * 60 * 1000;
    const checkTimeout = () => {
      const currentTime = new Date().getTime();
      if (currentTime - lastOutput > twoMinutes) {
        core.error('saucectl: timed-out');
        resolve(-1);
      } else if (!exited) {
        setTimeout(checkTimeout, 1000); // Check every 1 second
      }
    };

    checkTimeout();
  });
}

module.exports = { awaitExecution };
