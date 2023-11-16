# Saucectl Run Action from Sauce Labs

This action installs [saucectl](https://github.com/saucelabs/saucectl/) and launches tests. \
You can use it to run your tests on Sauce Labs !

## Usage

:warning: Avoid being throttled by GitHub. Be sure to provide `GITHUB_TOKEN` through
the `env` field, or you may face an `API rate limit exceeded` error.

```yaml
- uses: saucelabs/saucectl-run-action@v4
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    # Which version of saucectl.
    # Default: latest
    saucectl-version: v0.123.0

    # Sauce Labs Credentials.
    sauce-username: ${{ secrets.SAUCE_USERNAME }}
    sauce-access-key: ${{ secrets.SAUCE_ACCESS_KEY }}

    # Install saucectl, but don't run it.
    # Default: false
    skip-run: false

    # Relative path under $GITHUB_WORKSPACE to use as the new working directory.
    working-directory: ""

    # An environment variable key-value pair that may be referenced in the tests executed by this command.
    # Currently not supported by espresso/xcuitest.
    env: |
      MY_FIRST_VAR=VALUE
      MY_SECOND_VAR=VALUE

    # Specify an alternative configuration file for this execution.
    # Default: .sauce/config.yml
    config-file: .sauce/myconfig.yml

    # Specifies the Sauce Labs data center through which tests will run.
    # Valid values are us-west-1 or eu-central-1.
    region: us-west-1

    # Controls how many suites run in parallel.
    # Default: 1
    concurrency: 1

    # Global timeout that limits how long saucectl can run in total.
    # Supports duration values like '10s', '30m' etc.
    timeout: 5m

    # Identifies an active Sauce Connect tunnel to use for secure connectivity to the Sauce Labs cloud.
    tunnel-name: ""

    # Identifies the Sauce Labs user who created the specified tunnel, which is required if the user running the tests did not create the tunnel.
    tunnel-owner: ""

    # Specifies a test suite to execute by name rather than all suites defined in the config file.
    select-suite: ""

    # Includes the contents of the suite's console.log in the output of the command regardless of the test results. By default, the console log contents are shown for failed test suites only.
    # Default: false
    show-console-log: false

    # Launches tests without awaiting outcomes; operates in a fire-and-forget manner.
    async: false
```
