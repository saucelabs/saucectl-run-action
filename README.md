# Saucectl

This action install and launch [saucectl](https://github.com/saucelabs/saucectl/) tests.

## Usage

### Basic

```
      - uses: saucelabs/saucectl-action@master
```

### Advanced

```
      - uses: saucelabs/saucectl-action@master
        with:
          saucectl-version: v0.24.2
          working-directory: ./testrunner-toolkit/cypress/
          region: us-west-1
          environment: sauce
        env:
          SAUCE_USERNAME: ${{ secrets.SAUCE_USERNAME }}
          SAUCE_ACCESS_KEY: ${{ secrets.SAUCE_ACCESS_KEY }}

```

## Parameters

### saucectl-version

The version of saucectl to be used. \
By default, latest version available is used.

### working-directory

This parameters allow you to run a project outside of the root folder of the repository.

### config-file

Sets the config file to be used. \
*Default*: `.sauce/config.yml`.

> This value is relative to `working-directory`.

### region

Sets the region to be provided to saucectl.

> Similar to `--region <region>` parameter available in saucectl.

### environment

Sets the testing environment. \
Values: `docker` or `sauce`

> Similar to `--test-env <env>` parameter available in saucectl.

### skip-run

Sets the action to only install saucectl but avoid executing tests.


### suite

Sets which suite to be run.

> Similar to `--suite <suite>` parameter available in saucectl.
