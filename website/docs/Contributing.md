---
slug: "/contributing"
---

# Contributing

## Common commands

- `npm install` - installs dependencies and runs postinstall scripts for all packages using `lerna bootstrap`
- `npm test` - runs test suite for all packages
- `npm run clean` - clean up build artifacts by recursively removing files and directories not under version control including git ignored files.
- `npm run storybook` - start the storybook server and opn UI component library in your browser. Auto-refreshes on update.
  ...and many more listed below

The geoprocessing code repository is setup as a "monorepo" managed by [Lerna](https://github.com/lerna/lerna). It contains multiple `packages` including the core `geoprocessing` library, and then multiple user-installable `templates`. These templates are bundled into the core library at build time.

## Documentation Website

A versioned documentation website is maintained using [Docusaurus](https://docusaurus.io/l) in the `website` directory. Docs should be updated in lockstep with code changes.

- cd `website`
- Dev - `npm start` to start dev server, generate new API documents. Edits will appear instantly in browser
- Build - `npm build` and `npm serve` to test
- Version - `npm run docusaurus docs:version <VERSION_NUMBER>` - snapshot a new version. Only do this when a new minor or major release is made. If point release should be unnecessary.
- Deploy - `GIT_USER=<YOUR_GITHUB_USERNAME> npm run deploy` to build and deploy to Github Pages. You can deploy as often as needed. If a new release snapshot is not made then doc changes are limited to the "Next" version on the website.

VSCode provides excellent features for [editing markdown](https://code.visualstudio.com/docs/languages/markdown#_editing-markdown) as well as [previewing](https://code.visualstudio.com/docs/languages/markdown#_markdown-preview) and is highly recommended for all but small changes.

## Storybook Website

Storybooks are published for each major and minor version of geoprocessing.

- Checkout a local copy of `geoprocessing/gp-storybook` repository alongside the `geoprocessing` library.
  - `cd packages/geoprocessing`
  - `npm run build:storybook` - will build static storybook site in packages/geoprocess/docs/storybook and copy it over to gp-storybook/Next overwriting the existing.
- (optional) If you also want to take a release snapshot of the storybook
  - `cd gp-storybook`
  - `cp -r Next version-x.y.z`
- Push all results to gp-storybook gh-pages branch (default) and will automatically build and update [https://seasketch.github.io/gp-storybook](https://seasketch.github.io/gp-storybook)

## Core library setup

To contribute to the library, you'll need to set it up on your local system. First, follow the [system setup](./tutorials/Tutorials.md) tutorial.

Then checkout the repo and run the install script. This will install lerna, bootstrap each package, and prepare an initial build of the geoprocessing library.

```sh
git clone https://github.com/seasketch/geoprocessing.git
cd geoprocessing
npm install
```

You should now be able to run tests for all packages

```sh
npm run test
```

## Make code changes

Any changes you make to the Typescript code in `src` won't be reflected in the Javascript code in `dist` until you compile it. You can do this a few different ways. Watch modes are useful for active development, new changes will be compiled automatically as you go.

VS Code - Press Command+Shift+B to open the build menu

- `geoprocessing build` - build core library
- `geoprocessing build scripts` - build scripts only
- `geoprocessing watch` - build core library and watch for changes
- `geoprocessing watch scripts` - build scripts only and watch for changes

CLI - from packages/geoprocessing folder

- `npm run prepare` - compile core Typescript library and scripts using `tsc`. Also runs automatically on initial install and publish
- `npm run watch` - build core library and watch for changes
- `npm run watch:scripts` - build scripts only and watch for changes

## Upgrading Dependencies

Upgrading package dependencies should be done carefully. The `ncu` command is a good way to do this in chunks. Run the following command in each of the root geoprocessing directory, `geoprocessing/packages/geoprocessing`, and each of the `geoprocessing/packages/template-*` directories:

`npx ncu --interactive --format group`

Use the spacebar to select all the packages to update. `patch` and `minor` release updates should be safe to do without fear of breaking changes. `major` updates should be left for last and done carefully, possibly even one at a time. Any dependency that has co-dependencies, for example babel with its plugins, should be upgraded at the same time, and match version number appropriately. Brand new releases, particularly majore releases can have bugs and upgrading to the latest and greatest is not always the best idea. Test in stages and as you go so that the cause is easier to figure out. Even doing full deployments, checking storybook, etc. to make sure working properly. Dependency upgrades should be done at least quarterly, monthly is better.

## Internationalization (i18n)

The geoprocessing framework implements the [GIP-1](./gip/GIP-1-i18n.md) proposal for language translation, and uses POEditor as its third-party service for translators to provide translations.

The language translation [tutorial](/tutorials/Tutorials.md) contains a lot of useful information on workflow. Managing translations internally for the library is very similar with some differences.

- `extract:translation`
  - Extracts all translations from the geoprocessing package and all template packages using babel and [babel-plugin-i18next-extract](https://github.com/gilbsgilbs/babel-plugin-i18next-extract) to `packages/geoprocessing/src/i18n`.
- `publish:translation`
  - Posts translations for all langauges to POEditor. Behavior is pre-configured via `src/i18n/config.ts`. Do not edit this file unless you need to.
  - Translations with namespace specified by `localNamespace` are written to POEditor with context value of `base` (context specified by `remotextContex` property in `src/i18n/config.son`).
  - All english translations are published, overwriting any in POEditor, since the code is their source of truth.
  - For non-english languages, POEditor is the source of truth, so if a translation is not defined in POEditor, then a local translation is published if available.
- `import:translation`
  - Fetches translations from POEditor for all non-english languages having `base` context value (context specified by `remotextContex` property in `src/i18n/config.son`). Any existing translation values will be overwritten. Translations are saved to the default `translation` namespace (as specified by the `localNamespace` property in `project/i18n.json`).
- `sync:translation`
  - A convenience command to keep the code, local translations, and remote translations in sync. Simply runs in succession `extract`, `publish`, then `import`.

## Testing

Within the geoprocessing package, there are numerous test commands that run different groups of tests. Some of these test commands start an accompanying web server on port 8080 automatically, and some require that you do that on your own before running the test command.

Test groups:

- `unit`: bite size tests for a specific function or small component of the system.
- `e2e`: end-to-end tests that test larger parts of the system. May make network calls, make system calls, or expect a web server on a specific port. These tests may take longer, or only run locally, and therefore are often excluded by a test command, or not run in CI. Be aware of this and have a regiment of running e2e tests.
- `smoke`: tests that make sure a functions/components main functionality is working (e.g. reference to hardware that doesn't smoke when you turn it on). The core geoprocessing library doesn't really have tests with this group name but it could, opting to just call them unit tests, but in project-space, every geoprocessing function has an accompanying smoke test, and suite of sketches for running against to verify successful output.

If your test is a unit test, then name it with the `.test.ts` extension like `myModule.test.ts`. If your test is an end-to-end test, meaning it makes network calls, requires a test data server to be running, or is a higher-level test of many lower-level modules, then name it with the `.e2e.test.ts` extension like `myModule.e2e.test.ts`. All of these tests will run in a `node` environment.

If you are writing test for UI component or hooks, then put your test in the `src/components` or `src/hooks` directory and use the `myModule.test.ts` extension. Tests in these folders will be run in a `jsdom` environment.

Rundown of the various test commands. These are really just shortcuts to running jest commands.

| command                     | description                       | test groups run | auto-starts web server | accepts matcher string/regex |
| --------------------------- | --------------------------------- | --------------- | ---------------------- | ---------------------------- |
| test                        | run unit tests. Used by Github CI | unit            | no                     | no                           |
| test:matching               | run unit tests                    | unit            | no                     | yes                          |
| test:e2e                    | run e2e tests                     | e2e             | yes                    | no                           |
| test:local                  | run all tests                     | unit, e2e       | yes                    | no                           |
| test:scripts                | run unit tests in scripts folder  | unit            | no                     | no                           |
| test:scripts:matching       | run unit tests in scripts folder  | unit            | no                     | yes                          |
| test:scripts:e2e            | run e2e tests                     | e2e             | yes                    | no                           |
| test:scripts:local          | run all tests in scripts folder   | unit, e2e       | yes                    | no                           |
| test:scripts:local:matching | run all tests in scripts folder   | unit, e2e       | no                     | yes                          |

### Matching test

For example a matching test command to run a specific test or set of tests could be as follows:

```bash
npm run test:matching keyBy
or
npm run test:scripts:local:matching importVectorDatasource
or with a regular expression
npm run test:scripts:local:matching "/import*Datasource/"
```

See Jest docs for more info. The command will match on the name you give within a test() call so choose your name to be unique enough to select the tests you want. Note that matching tests are run one at a time in order (aka `runInBand` for Jest) so that you get consistent output that you can debug

## E2E test data on port 8001

Jest starts a web server on localhost port 8001 (see geoprocessing/scripts/jest.config.ts) that serves up the `geoprocessing/scripts/data/out` folder. A number of e2e tests in the scripts folder use this such as `precalcVectorDatasource.test.ts` and `precalcRasterDatasource.test.ts`.

## E2E test data on port 8080

Test commands that include the e2e test group all start a web server on localhost port 8080 (see packages/geoprocessing/package.json).

## Geoprocessing project test data on port 8080

Be aware that geoprocessing projects also have a `start:data` command and they all use 8080 by default, but fallback to another port if 8080 isn't available without telling you. so your tests may unexpectedly fail with network connection errors, or seemingly more vague errors about "block size" for a Cloud-optimized Geotiff. Just make sure you have a web server started and that you aren't running more than one. Check other vscode windows for shells running `start:data` and kill them.

If you want to run a test command that lets you match on a test name like `test:scripts:e2e:matching`, then you'll need to start your own web server using the following command:

```bash
npm run start:data
```

If you use the VSCode launcher to debug tests you will also need to manually start a web server as it will not auto-start them. Again look for connection or block size errors as a clue.

You can alway open a browser and navigate to `http://127.0.0.1:8080` and see if you get back a file directory with the files you expect!

## Debugging

The geoprocessing library provides VSCode debug launchers for its test suites, templates and translation machinery. With the geoprocessing repo checked out and open in VSCode, just add a breakpoint or a `debugger` call in one of the core tests, click the `Debug` menu in the left toolbar (picture of a bug) and select the appropriate package. The debugger should break at the appropriate place.

### Debugging Functions

As you build report functions, using console logging or inspecting with a VSCode debugger may not be enough. You may want to make sure the output is properly formatted JSON/GeoJSON, or looks appropriate on a map, or try using the file in another software library. Here's a simple workflow that can make this easier:

- Write a unit test that calls your function
- In your function, use the `toJsonFile` helper to write out any Javascript object to a nicely formatted file.
- If you output a `.geojson` file you can open it in vscode, check for errors, and view it using the Map Preview extension.
- Make any necessary changes to your code and run the test again to regenerate the files.
- Clean up your temporary files when done

## Storybook components

The framework has it's own storybook project that can be launched using `npm run storybook`. These components and their stories can be found under `packages/geoprocessing/src/components/`. As common ui patterns are developed the intention is to create a library of useful components with good documentation that report authors can use.

## Make and Test Modifications

Making changes to geoprocessing UI components, toolbox functions, and utilities can be pretty straightforward. Everything is handled within the library before committing.

- Make the necessary code changes
- Write unit tests that demonstrate its proper behavior
- Make sure you export your work up to the top-level for library users to be able import it
- Publish a new version of the library
- Update your existing geoprocessing project to use the new version

Making changes to framework CLI commands for example such as `init`, `build`, `import` and `deploy`, etc. can be more involved because to fully test it you need to bundle and often publish a new or experimental version of the geoprocessing library and then manually test it directly. A good methodology is to:

- Create unit or end-to-end tests in the geoprocessing framework for functions behind the CLI command
- Create unit or end-to-end tests in templates (template-blank-project, template-ocean-eez). Consider that users will also then get these tests when they install the template.
- Run `npm run prepare` from the `packages/geoprocessing` folder to do a build into the `packages/geoprocessing/dist` folder, which includes the CLI commands.
- To test the `init` commands, in your terminal you'll need to `cd` to the `packages` directory alongside `geoprocessing`. Then run the following and be sure to cleanup when you're done with testing:
  - `node node_modules/@seasketch/geoprocessing/dist/scripts/init/init.js`
- You can then test all the other CLI commands on this initialized proejct, or one of the existing sibling packages (base-project, template-ocean-eez, template-blank-project). Just `cd` into the sibling package, say `packages/base-project`, then run one of the following and be sure to cleanup when you're done with testing:
  - `node node_modules/@seasketch/geoprocessing/dist/scripts/init/createClient.js`
  - `node node_modules/@seasketch/geoprocessing/dist/scripts/init/createReport.js`
- Once you've done everything that you can locally, you can publish an alpha or [experimental](#experimental-releases) release of geoprocessing library and [init](#project-init-with-non-latest-version) a project with it, or update an existing project to use the new version (via package.json version).
- If you want to avoid publishing, you can create an [example project](#init-example-project) in the geoprocessing folder and then deploy it. You can then plug it into a SeaSketch sketch class and test using it, or run a [local client dev server](#running-local-client-dev-server) if you want to debug your report clients more directly outside of an iframe.

### Init example project

This will run the project init function directly from your library build. When you run it, call your project something lik example-project-[insert some unique word] to avoid collisions with any other projects

```bash
cd /PATH/TO/geoprocessing
npm install # make sure all installed, and prepre is run doing a build
cd packages
node geoprocessing/dist/scripts/init/init.js # follow the tutorial if needed
npm install
```

Upon running install, as long as your version of geoprocessing in your example projects package.json matches the current version in `packages/geoprocess/package/json` then lerna will symlink your example project to use the sibline geoprocessing folder for its dependency. You can confirm the symlink is in place with `ls -al packages/geoprocess/node_modules/@seasketch`. If it's not then check your geoprocessing version, and run `npm install` again after changing.

Now follow the tutorial to generate example sketches/features, run smoke tests, build, and deploy this project. If you deploy your stack, you can then import datasources, plug it into seasketch, etc.

#### Testing CLI commands

You can also now do additional development in geoprocessing, such as to CLI commands, and test them with your example project. Just make sure to you run `npm run prepare` in your geoprocessing folder first to transpile and bundle everything to dist (which is where project CLI commands run code from), or use `npm run watch` if your changes are limited to src folder, or `npm run watch:scripts` if your changes are limited to scripts folder. This can speed up your development loop.

#### Testing Report Clients

If you've deployed your example project, and you want to do some testing/debugging of your report clients more directly against it (outside of a seasketch iframe), you can run a local client dev server (see next section).

Once you're done with your example project don't forget to cleanup:

```bash
npm run destroy
cd ..
rm -rf example-project-foo
```

### Running local client dev server

Sometimes running report clients in storybook isn't enough. You might be debugging or making changes to the underlying client infrastructure, and need a faster development cycle than deploying every change to AWS first.

You can serve up all of your report clients locally, straight out of your `.build-web` folder. You just need to have a geoprocessing stack already deployed with all of the geoprocessing functions in place that your report clients expect. Just follow these steps:

```bash
# Make any edits you want to your report client
npm run build:client
npm run start:client
```

Browse to `http://localhost:8080/?service=SERVICE_URL` where SERVICE_URL is the URL of your deployed geoprocessing projects Rest API endpoint. An example is `http://localhost:8080/?service=https://bhxn1rmxf5.execute-api.us-west-1.amazonaws.com/prod/`.

This would load the report client app, which will fetch the service manifest from the service URL. The client app is now ready for you to send it a message using the `postMessage` API, the same API that seasketch uses to send messages to the report client app it runs in an iframe.

```javascript
window.postMessage({
  type: "SeaSketchReportingMessageEventType",
  client: "MpaTabReport",
  language: "en",
  geometryUri: "https://legacy.seasketch.org/geojson/625a657273095115bb25e275",
  sketchProperties: {
    id: "625a657273095115bb25e275",
    name: "Azores Test Sketch",
    createdAt: "2021-04-20T20:28:03.607Z",
    updatedAt: "2021-04-20T20:28:03.607Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: false,
    userAttributes: [],
    visibleLayers: [],
  },
});
```

The parameters you may want to change include:

- `client` - MpaTabReport is the default client published by the ocean EEZ template. You might have your own report client name. Check your geoprocessing.json or browse to the service URL and look at the list of available clients.
- `language` - en or English is the default. You can choose any supported language, for example `pt` for Portuguese.
- `geometryUri` - this is the URL that report clients will give to geoprocessing functions to load the sketch from to operate on. Change it to any valid sketch URL.
- `sketchProperties` - these are the sketch properties that seasketch would normally pass to the report client. You can override these however you want, which you will need to if you have report clients that require or change their behavior depending on sketch attributes present.

### Test local gp project against local geoprocessing

To test with projects other than `example-project` on your local machine, npm link is a handy tool. From within `packages/geoprocessing` run the command `npm link`. This will make the library available to other packages locally (assuming the same version of node. watch out nvm users!). Then change to you project directory and run `npm link @seasketch/geoprocessing`. Any changes you make to the library will automatically be reflected in your geoprocessing implementation. Just watch out for a couple common problems:

1. Make sure VSCode is running the two build processes, and they complete without errors. Implementations import code from `dist/`, not the source typescript files.
2. Running npm install within your geoprocessing project can interact oddly with npm link and produce errors. If you suspect problems redo the linking process again after all your installs. You will need to run `npm unlink @seasketch/geoprocessing --no-save` in your project directory. You can then try and relink.

Further link troubleshooting steps:

- If still issue you can fully unlink and relink the geoprocessing project as a global npm package. `npm unlink @seasketch/geoprocessing` in the geoprocessing package. If you run `npm list -g --depth 0` and still see the geoprocessing package globally then also run `npm unlink -g @seasketch/geoprocessing`. Now follow the complete steps again to relink.
- If still issue, then consider also deleting your `node_modules` directory and `package-lock.json` file in your project directory to start fresh as they may have been put into an incosistent state by the linking.

## Publishing

## Stable release

New stable releases of the framework are published from the `main` branch. To do this:

- make sure all code has been committed and tests are passing.
- Run `npm run publish:stable` from the top-level geoprocessing directory.
- This will generate new build artifacts in the `dist` folder first using the `prepare` script.
- Then you will be asked whether this is a patch, minor, or major release. Please follow [semantic versioning conventions](https://semver.org/).
- On publish, the release package will be submitted to NPM and made available under the `latest` tag such that anyone installing geoprocessing or running its init script will get this latest version.
- A git tag with the name of the version number will also be published to Github.

The final step is to publish [release](https://github.com/seasketch/geoprocessing/releases) notes. Go to the release page and

- Click `Draft a new release` button.
- Choose the release tag just created in the publish step.
- Click `Generate release notes` button.
- Add subheadings (e.g 💥 Breaking Changes, 🚀 New Feature / Improvement) and organize the generated bullet list into them. Look at past releases for how to do this.
- Be sure to review deeper into your commit logs and manually add additional bullet points to the release notes. Include any deprecations, internal enhacements, doc enhancements, etc.
- Add one or more paragraphs at the top of the release notes summarizing the release and any steps the user needs to take on upgrade.
- Publish the release notes.

## Alpha and Beta canary Prerelease

You can publish `alpha` and `beta` prereleases prior to a stable release. This will advance the version numbers in package.json and generate a release tag.

```sh
npm run publish:alpha
```

or

```sh
npm run publish:beta
```

Then press the Enter key to choose `❯ Custom Prerelease`
Then press the Enter key when it asks you Enter a prerelease identifier. It will use a default name, something like `7.0.0-beta.1`.

As you create more beta releases, it will automatically increment the beta number and maintain the naming scheme.

## Backport Release

A backport release should be published when you backport features or bug fixes to a previous major version of the code. For example critical bug fixes developed for 7.x, backported to 6.x.

A backport release is a normal release, in that you choose whether it is a patch or a minor release, and it will advance the version to the next number e.g. 6.1.2 would become either 6.1.3 (patch) or 6.2.0 (minor). The only different is that the `backport` distribution tag is applied to the release, rather than `latest`.

The suggested method to do a backport release is to checkout a prior release tag, then create a new branch

```sh
git checkout tags/v6.1.2
git checkout -b v6.2.0
<edit, commit and push code>
npm run publish:backport
```

Choose minor release 6.2.0

## Experimental Releases

If you want to work on a feature outside of dev in a feature branch, and publish it and test it, you can publish it as an `experiment`. Make sure that you publish it from a feature branch, typically with the same name you will give your experiment.

```sh
npm run publish:experimental:canary
```

Assuming your branch name is `node16-webpack5`, the current GP version is 0.15.0, and your feature branch is 28 commits ahead of the last release tag, this should publish a minor release called `0.15.1-experimental-node16-webpack5.28`. As you push more commits to your experimental branch, you can publish again at any time and the commit number will increment so that there isn't a name collision.

## Project init with non-latest version

If you want to test running a project `init`, using something other than the `latest` version published to NPM, you just need to provide the explicit version. For example:

```sh
npx @seasketch/geoprocessing@0.15.1-beta.1 init 0.15.1-beta.1
```

## Wiki

Diagrams are maintained in internal SeaSketch [drive share](https://drive.google.com/drive/folders/1JL7BkOf2mP2VaXQKlM2kkENqHW9LtCbm?usp=sharing)

## i18n

Localization is managed using [i18next](https://react.i18next.com/). Wrap _all_ strings displayed in report client UIs in appropriate tags so they can be translated into multiple languages. ESLint rules will flag missing tags.

We're using a [public POEditor project](https://poeditor.com/join/project?hash=juloLqMZDP) to manage translations. Local npm scripts exist to publish new terms to this project and extract translations into the `packages/i18n` directory. Run `npm run sync:translation` to perform these operations. It is important to do this regularly. The CI system will build a newly updated clients, but will only include new translations if this step is performed and changes are checked in.

### i18n namespaces

Terms are organized into [namespaces](https://react.i18next.com/guides/multiple-translation-files), each with their own translation file.

To add new namespaces as new features are launched, edit `packages/i18n/namespaces.json`.

### Adding new languages

To add new supported languages, add required metadata to `packages/i18n/languages.json`. You will also need to add a matching entry to any POEditor projects using their GUI.

### Architecture

- extract:translation - extract translations from code to `packages/i18n/lang/en` using babel and i18next-extract plugin
- publish:translation - publish term namespaces to poeditor, updating existing terms and adding new terms
- import:translation - download poeditor translated terms to local cache in `packages/i18n/lang`
- sync:translation - runs both extract/publish and import to sync local with poeditor

POEDITOR_PROJECT and POEDITOR_API_TOKEN environment variables must be pre-loaded in your shell environment to publish and import from poeditor.com.

OPTION 1 - packages/i18n

- publish it as @seasketch/geoprocessing-i18n
- translations are stored within the published package
- on project init, translations are copied from i18n directory to project space
- project report client imports i18n.ts file from i18n lib
- geoprocessing and template packages can import the sibling i18n package and import i18n.ts the same way.

pros

- sibling packages import from @seasketch/geoprocessing-i18n
- i18n package is independent of geoprocessing package on npm and could potentially be upgraded independently by a project.

cons

- have to transpile and publish a separate package from geoprocessing. But that opens the door to breaking down the gp monolith. Opportunity to use esm module?

OPTION 2 - geoprocessing/src/i18n

- store translations and related code in geoprocessing package
- monorepo root calls
- bundle lang json files just like templates into build
- projects and sibling template packages will import i18n init from @seasketch/geoprocessing/i18n entry point (similar to dataproviders)
  on project init, generate i18n directory in project space, copy the lang assets out.
- each project/template will have its own translate CLI commands.

### Creating core translations

babel - with babelrc, uses i18n-extract to bundle translations, which can be served to the client.

Namespaces is `core` and combines:

- geoprocessing (src/components, src/rbcs/components, src/iucn/)
- template-blank-project
- template-ocean-eez
- template-addon-\* (future packages)

### Creating gp project translations

### Loading project translations

i18n.ts is used to detect the current language and load the translations from teh backend

Load core translations
Load project translations
Merge them?

### Questions

- Should we use SeaSketch Next project for gp and gp project translations? Yes I think so in order to have centrally managed translator access

Yes

- Should translation machinery be kept in a monorepo package that works across all packages to pull together and merge translations?

- how does translation loading work on client side?

load should happen in top level of report client, so that it can load project specific translations, which may override core translations.

Report developer should not have to deal with this. Perhaps move ReportPage out of client-ui as Should be built-in or part of template-blank-project report client, and create:function client.

Answers

- what to do with big chunks of text with html sprinkled in? such as used in learn more section of reports?
  - it looks like you can wrap text that includes html tags into `<Trans/>` component

### Problems

each report client is loading i18n.ts on startup in storybook causing collision
Similar issue and suggestion to use createInstance - https://github.com/i18next/react-i18next/issues/1234
