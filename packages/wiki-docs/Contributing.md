- [Common commands](#common-commands)
- [Documentation](#documentation)
- [Core library setup](#core-library-setup)
- [Make code changes](#make-code-changes)
- [Debugging](#debugging)
- [Storybook components](#storybook-components)
- [Testing integration with project implementations](#testing-integration-with-project-implementations)

# Common commands

- `npm install` - installs dependencies and runs postinstall scripts for all packages using `lerna bootstrap`
- `npm test` - runs test suite for all packages
- `npm run clean` - clean up build artifacts by recursively removing files and directories not under version control including git ignored files.
- `npm run start-storybook` - start the storybook server and opn UI component library in your browser.  Auto-refreshes on update.
...and many more listed below

The geoprocessing code repository is setup as a "monorepo" managed by [Lerna](https://github.com/lerna/lerna).  It contains multiple `packages` including the core `geoprocessing` library, and then multiple user-installable `templates`.  These templates are bundled into the core library at build time.

# Documentation

documentation is maintained in the [wiki](https://github.com/seasketch/geoprocessing/wiki).  You can edit the wiki using the Github web editor, or edit it locally and commit changes.

VSCode provides excellent features for [editing markdown](https://code.visualstudio.com/docs/languages/markdown#_editing-markdown) as well as [previewing](https://code.visualstudio.com/docs/languages/markdown#_markdown-preview) and is highly recommended for all but small changes.

# Core library setup

To contribute to the library, you'll need to set it up on your local system.  First, follow the base [setup tutorial](Tutorials#initial-system-setup).

Then checkout the repo and run the install script.  This will install lerna, bootstrap each package, and prepare an initial build of the geoprocessing library.

```sh
git clone https://github.com/seasketch/geoprocessing.git
cd geoprocessing
npm install
```

You should now be able to run tests for all packages

```sh
npm run test
```

# Make code changes

Any changes you make to the Typescript code in `src` won't be reflected in the Javascript code in `dist` until you compile it.  You can do this a few different ways.  Watch modes are useful for active development, new changes will be compiled automatically as you go.

VS Code - Press Command+Shift+B to open the build menu

- `geoprocessing build` - build core library
- `geoprocessing build scripts` - build scripts only
- `geoprocessing watch` - build core library and watch for changes
- `geoprocessing watch scripts` - build scripts only and watch for changes

CLI - from packages/geoprocessing folder

- `npm run prepare` - compile core Typescript library and scripts using `tsc`.  Also runs automatically on initial install and publish
- `npm run watch` - build core library and watch for changes
- `npm run watch:scripts` - build scripts only and watch for changes

# Testing

Within the geoprocessing package, there are numerous test commands that run different groups of tests.  Some of these test commands start an accompanying web server on port 8080 automatically, and some require that you do that on your own before running the test command.

Test groups:

- `unit`: bite size tests for a specific function or small component of the system.
- `e2e`: end-to-end tests that test larger parts of the system. May make network calls, make system calls, or expect a web server on a specific port.  These tests may take longer, or only run locally, and therefore are often excluded by a test command, or not run in CI.  Be aware of this and have a regiment of running e2e tests.
- `smoke`: tests that make sure a functions/components main functionality is working (e.g. reference to hardware that doesn't smoke when you turn it on).  The core geoprocessing library doesn't really have tests with this group name but it could, opting to just call them unit tests, but in project-space, every geoprocessing function has an accompanying smoke test, and suite of sketches for running against to verify successful output.

To assign a test file to a specific group, add the following comment to the header of your test file.  Jest will only run the test if the `unit` group is included in the test run (by default all groups will be included unless you specifically whitelist or blacklist

```javascript
/**
 * @group unit
 */
```

If your test file has dependencies (like Geoblaze for example) that requires a full node environment and all of its base modules to operate (Jest by default I think uses a lighter weight environment that runs faster?), then you need at add a directive for that in your test file.  For example:

```javascript
/**
 * @jest-environment node
 * @group e2e
 */
```

Rundown of the various test commands.  These are really just shortcuts to running jest commands.

| command | description | test groups run | auto-starts web server | accepts matcher string/regex |
|---|---|---|---|---|
| test | run unit tests.  Used by Github CI | unit | no | no |
| test:matching | run unit tests | unit | no | yes |
| test:e2e | run e2e tests | e2e | yes | no |
| test:local | run all tests | unit, e2e | yes | no |
| test:scripts | run unit tests in scripts folder | unit | no | no |
| test:scripts:matching | run unit tests in scripts folder | unit | no | yes |
| test:scripts:e2e | run e2e tests | e2e | yes | no |
| test:scripts:local | run all tests in scripts folder | unit, e2e | yes | no |
| test:scripts:local:matching | run all tests in scripts folder | unit, e2e | no | yes |

## Matching test

For example a matching test command to run a specific test or set of tests could be as follows:

```bash
npm run test:matching keyBy
or
npm run test:scripts:local:matching importVectorDatasource
or with a regular expression
npm run test:scripts:local:matching "/import*Datasource/"
```

See Jest docs for more info.  The command will match on the name you give within a test() call so choose your name to be unique enough to select the tests you want.  Note that matching tests are run one at a time in order (aka `runInBand` for Jest) so that you get consistent output that you can debug

# Local web server

A local web server is used to serve test data on port 8080 within many e2e tests.  Test commands will only auto-start a web server if it includes the e2e group and isn't a matcher command.  If you want to run a matcher command that runs e2e tests, then you'll need to start your own web server using the following command:

```bash
npm run start-data
```

Be aware that geoprocessing projects also have a start-data command and they all use 8080 by default, but fallback to another port if 8080 isn't available without telling you.  e2e tests will expect to find data on 8080, so your tests may unexpectedly fail with network connection errors, or seemingly more vague errors about "block size" for a Cloud-optimized Geotiff. Just make sure you have a web server started and that you aren't running more than one.  Check other vscode windows for shells running start-data and kill them.

If you use the VSCode launcher to debug tests you will also need to manually start a web server as it will not auto-start them.  Again look for connection or block size errors as a clue.

You can alway open a browser and navigate to `http://127.0.0.1:8080` and see if you get back a file directory with the files you expect!

# Debugging

The geoprocessing library and example-project both provide debug launchers for their test suite, just as the project template does.  With the geoprocessing repo checked out and open in VSCode, just add a breakpoint or a `debugger` call in one of the core tests, click the `Debug` menu in the left toolbar (picture of a bug) and select the appropriate package.  The debugger should break at the appropriate place.

## Debugging Functions

As you build report functions, using console logging or inspecting with a VSCode debugger may not be enough.  You may want to make sure the output is properly formatted JSON/GeoJSON, or looks appropriate on a map, or try using the file in another software library. Here's a simple workflow that can make this easier:

- Write a unit test that calls your function
- In your function, use the `toJsonFile` helper to write out any Javascript object to a nicely formatted file.
- If you output a `.geojson` file you can open it in vscode, check for errors, and view it using the Map Preview extension.
- Make any necessary changes to your code and run the test again to regenerate the files.
- Clean up your temporary files when done

# Storybook components

The framework has it's own storybook project that can be launched using `npm run start-storybook`. These components and their stories can be found under `packages/geoprocessing/src/components/`. As common ui patterns are developed the intention is to create a library of useful components with good documentation that report authors can use.

# Testing integration with project implementations

Testing modifications to the framework, particularly build steps, can be tricky because of the varying environments under which the code may run. A good methodology is to first create unit tests and verify that they run, then modify `packages/example-project` and its unit tests and verify the tests run and `npm run build` steps work. It is not uncommon for these steps to pass and for bugs to still appear after publishing of the framework, so manual testing after publishing should be done as well.

To test with projects other than `example-project` on your local machine, npm link is a handy tool. From within `packages/geoprocessing` run the command `npm link`. This will make the library available to other packages locally (assuming the same version of node. watch out nvm users!). Then change to you project directory and run `npm link @seasketch/geoprocessing`. Any changes you make to the library will automatically be reflected in your geoprocessing implementation. Just watch out for a couple common problems:

  1. Make sure VSCode is running the two build processes, and they complete without errors. Implementations import code from `dist/`, not the source typescript files.
  2. Running npm install within your geoprocessing project can interact oddly with npm link and produce errors. If you suspect problems redo the linking process again after all your installs. You will need to run `npm unlink @seasketch/geoprocessing --no-save` in your project directory.  You can then try and relink.
  
  Further link troubleshooting steps:

- If still issue you can fully unlink and relink the geoprocessing project as a global npm package. `npm unlink @seasketch/geoprocessing` in the geoprocessing package.  If you run `npm list -g --depth 0` and still see the geoprocessing package globally then also run `npm unlink -g @seasketch/geoprocessing`.  Now follow the complete steps again to relink.
- If still issue, then consider also deleting your `node_modules` directory and `package-lock.json` file in your project directory to start fresh as they may have been put into an incosistent state by the linking.

# Publishing

To publish a new release of the framework, make sure you are in the `master` branch with no outstanding code changes. Then run the following:

```sh
npm run publish:stable
```

By default, a stable release will be tagged as `latest` so that users installing from npm will get it by default.

Please follow [semantic versioning conventions](https://semver.org/).  This will generate new build artifacts in the `dist` folder first using the `prepare` script.

# Alpha and Beta Canary Releases

You can also publish `alpha` or `beta` canary releases out-of-band to quickly test new features and publish them, without bumping the version number. These releases are not tagged as `latest`, so they aren't installed unless a user targets them specifically.  Make sure that you create them from the dev branch.

```sh
npm run publish:alpha:canary
npm run publish:beta:canary
```

Assuming the current GP version is say 0.15.0, and you've made 5 commits to the dev branch since the last release, this should publish a minor canary release called `0.15.1-alpha.5` or `0.15.1-beta.5`.  As you push more commits to the dev branch, you can publish again at any time and the commit number will increment so that there isn't a name collision.

# Experimental Releases

If you want to work on a feature outside of dev in a feature branch, and publish it and test it, you can publish it as an `experiment`.  Make sure that you publish it from a feature branch, typically with the same name you will give your experiment.

```sh
EXPERIMENT_ID=my_branch_name npm run publish:experimental:canary
```

Assuming your branch name is `node16-webpack5`, the current GP version is 0.15.0, and your feature branch is 28 commits ahead of the last release tag, this should publish a minor release called `0.15.1-experimental-node16-webpack5.28`. As you push more commits to your experimental branch, you can publish again at any time and the commit number will increment so that there isn't a name collision.

# Project init with non-latest version

If you want to test running a project `init`, using something other than the `latest` version published to NPM, you just need to provide the explicit version.  For example:

```sh
npx @seasketch/geoprocessing@0.15.1-beta.1 init 0.15.1-beta.1
```

# Wiki

Diagrams are maintained in internal SeaSketch [drive share](https://drive.google.com/drive/folders/1JL7BkOf2mP2VaXQKlM2kkENqHW9LtCbm?usp=sharing)