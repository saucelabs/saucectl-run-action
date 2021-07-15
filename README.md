# Saucectl Run Action from Sauce Labs

This action installs [saucectl](https://github.com/saucelabs/saucectl/) and launches tests. \
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

## skip-run

Skip execution of saucectl (only install binary).

## select-suite

Select the suite to run.

> Similar to `--select-suite <suite>` parameter available in saucectl.

## concurrency

Concurency to use.

> Similar to `--ccy <ccy>` parameter available in saucectl.

## env

Environement variables to add.

> Similar to `-e` parameter available in saucectl.

Due to github actions limitation, environement variables needs to be passed as a string. \
Example:
```
      - uses: saucelabs/saucectl-run-action@v1
        with:
          sauce-username: ${{ secrets.SAUCE_USERNAME }}
          sauce-access-key: ${{ secrets.SAUCE_ACCESS_KEY }}
          env: |
            MY_FIRST_VAR=VALUE
            MY_SECOND_VAR=VALUE
```

## showConsoleLog

Display console.log when tests succeed

> Similar to `--show-console-log` parameter available in saucectl.

## logDir

Path where to store logs.

> Similar to `--logDir <path>` parameter available in saucectl.
