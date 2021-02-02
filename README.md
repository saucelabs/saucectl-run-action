# Saucectl Run Action from Sauce Labs

This action install and launch [saucectl](https://github.com/saucelabs/saucectl/) tests. \
You can use it to run your tests on Sauce Labs !

## Example

### Basic

```
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
            # ...
            - uses: saucelabs/saucectl-run-action@v1
            # ...
```

### Advanced

```
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
        - uses: saucelabs/saucectl-run-action@v1
            with:
                sauce-username: ${{ secrets.SAUCE_USERNAME }}
                sauce-access-key: ${{ secrets.SAUCE_ACCESS_KEY }}
                saucectl-version: v0.25.1
                working-directory: ./testrunner-toolkit/cypress/
                testing-environment: sauce

```

## Inputs

## saucectl-version

Version of saucectl to use. \
Default: latest

## sauce-username

Sauce Labs user name.

## sauce-access-key

Sauce Labs Access Key.

##  working-directory

Folder in-which saucectl will be run.\
Default: `.`

## config-file

Configuration file to use with saucectl.\
Default: `.sauce/config.yml`

> This value is relative to `working-directory`.


## region

Region flag to pass to saucectl.

> Similar to `--region <region>` parameter available in saucectl.

## testing-environment

Testing Environment to use.\
Default: `docker`

> Similar to `--test-env <env>` parameter available in saucectl.

## skip-run

Skip execution of saucectl (only install binary).

## suite

Suite to run.

> Similar to `--suite <suite>` parameter available in saucectl.
