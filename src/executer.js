
const sauceConfig = {
    saucectlVersion: 'latest',
    install: true,
    run: {
        workingDirectory: ".",
        skip: false,
        configFile: ".saucectl/config.yml",
        region: "us-west-1",
        suite: undefined,
        timemout: 60,
        env: {

        },
    }
}

