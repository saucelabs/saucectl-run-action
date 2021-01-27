
async function awaitExecution(child) {
    return new Promise((resolve) => {
        child.on('exit', (exitCode) => {
            resolve(exitCode);
        });    
    });
}

module.exports = { awaitExecution };