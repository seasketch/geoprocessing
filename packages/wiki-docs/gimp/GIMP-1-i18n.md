# GIMP 1: i18n Localization

## Languages supported

* The geoprocessing library will target supporting all SeaSketch Next languages.
* Each geoprocessing project will by default be set to support all the same languages.  The core translations for all languages will get included, and then a translator will only need to translate all new report strings, for the languages needed for the project location.
* The i18n framework will automatically fallback to English if a string is not found for the given language.
* Supported languages are managed in the `i18n/supported.ts` file which will get added to over time.  When POEditor is used, then languages get added there as well for each one.

## Managing i18n in monorepo

* There are translation CLI commands (extract, import, publish, sync (all three)) in root of monorepo, and run from that location, in order to extract from all packages at once, and import/publish on one whole set of translated strings for the whole framework.
  * `translation:extract` will use babel, a babel.config.js, [babel-plugin-i18next-extract](https://github.com/gilbsgilbs/babel-plugin-i18next-extract) capable of extracting translations from `geoprocessing` and `template` packages into an i18n directory managed at `packages/geoprocessing/src/i18n`.
  * `translation:import` fetches translations for all languages from POEDITOR.  But only for `import` namespaces named in namespaces.json.
  * `translation:publish` posts translations for all languages from POEDITOR.  But only for `publish` namespaces named in namespaces.json
  * `translation:sync` which runs in succession `extract`, `publish`, then `import`
* namespaces are defined in `src/i18n/namespaces.json`.  Internal to the geoprocessing library, there will be just one core `gp` namespace containing all translations for core UI components, and template UI components. This is what it looks like below:

```json
{
  "import": [
    "gp"
  ],
  "publish": [
    "gp"
  ]
}
```

Notice that the namespaces to be imported can be separately configured from the namespaces to be published.  The need for this will become clear in the use cases below.

## Using translations within geoprocessing library in templates

* `template-*` monorepo packages are essentially little geoprocessing projects.  The only difference is Lerna symlink them to the sibling geoprocessing package on `npm install`.  You can treat templates just like a geoprocessing project and use all available CLI commands from within the monorepo.
* However, since we chose to converge all i18n translations into the geoprocess packages, if we want translations to load in storybook for templates, you have to symlink the core geoprocessing i18n over to the template.  Without that the storybook should still load but the translations will fail in error.
  * `ln -s packages/geoprocessing/src/i18n/ packages/template-ocean-eez/src/i18n

## On running geoprocessing `prepare` command

* i18n directory is copied into the dist folder as part of the base-project, with all `gp` namespace translations.  This makes it accessible on init.

## On running geoprocessing init command

* i18n directory is installed as part of base-project.
* `extract`, `import`, `publish`, and `sync` cli commands are included in package.json
* An `i18n:install` command is provided to copy `node_modules/@seasketch/geoprocessing/dist/base-project/i18n` for if you are upgrading to a new version of geoprocessing library and installing translations for the first time, or upgrading to the latest.
* `createProject()` updates namespaces.json to a new project-specific namespace, `gp-{project_name}`.  The `gp` namespace is not present now because initial core translations are already installed and because in the most common use case we don't want projects publishing terms for the `gp` namespace.  That is left to be managed within the monorepo.  More on this later.

```json
{
  "import": [
    "gp-testo"
  ],
  "publish": [
    "gp-testo"
  ]
}
```

## Client-side i18n load and switch

* SSN will send a language code within `SeasketchReportingInitEvent` message.
* It will pass the same code used in [SSN](https://github.com/seasketch/next/blob/master/packages/client/src/lang/supported.ts).
* geoprocessing library will maintain its own version of that file in its i18n folder, and if SSN sends a code that's not supported it will gracefully fallback to the default language, with a console.warn
* SSN will also send a new message to change language - `SeaSketchReportingChangeLanguageEvent` if the user switches.
* App.tsx will read the language code from the postMessage event sent by SSN and store this in context.  If there is a change language event, then this code stored in context will be updated.  The language will default to `en` English and be updated with the initial language passed by SSN.
* A `useLanguage()` hook will be provided that provides access to the current language stored in context and will trigger an update when the language changes.
* each project client will load translations by wrapping a `Translator` react component, which creates an `i18n` instance (using i18nAsync.ts that lazy loads languages by default but i18nSync.ts is also available) and passes it in to `i18nextProvider`.
* There is one i18n instance for each report client so that they are isolated and multiple can be loaded in storybook, or even an app at once.
* The Translator will listen for language changes using the useLanguage hook.  If it changes, it will tell the i18n instance to change it's language, which will load the appropriate resource file and all translations in the UI will update.

## Storybook

* Translations just work in storybook.  Its webpack setup supports dynamic imports.
* Since reports won't have a language switcher UI component, storybook should provide one. Just like for loading a sketch, it will add a default language to the mocked context provider, and change the language value when the language switcher.  This will update the useLanguage hook and trigger a re-render of everything.

## For all report development use cases

* the core gp translations will be installed on init or via `i18n:install` cli command and they will be ready to start.
* `translation:extract` will extract all translations for all namespaces, `gp` and `gp-testo` in this case, for the English language.
* `translation:import`, `translation:publish` and namespaces.json will only be relevant/used if POEDITOR is being used.  Other languages can be translated locally (and publish will send them to POEDITOR), or translations will be done in POEDITOR and import will bring them back.
* All report clients will get wrapped in a Translator components, just as is done in report clients installed by default.
* As developer creates new reports, they will wrap all strings destined to be displayed in the UI in translate functions using react-i18n such as `t()`, `<Trans>` etc.  They should assign the new strings to their project namespaces (e.g. `gp-testo`), not the `gp` namespace.
* If the user is upgrading their version of the geoprocessing library, and want the latest translations, or there is breaking changes to the i18n folder, they should move aside their current i18n directory, then run the `i18n:install` command.  Their may be breaking changes to the folder structure here, see the Changelog for more info.  Then they would need to manually merge any of their changes to the core translations, and their project specific namespace files for each language.
* Translators will need to translate all core `gp` strings for all seasketch languages.  But they will only need to translate strings in the project namespace (e.g. `gp-testo`) for the languages needed for the project.  If the user happens to select a language in seasketch next not supported by the reports, then they will fallback to English.

## Report development use cases

### 1. Reports developed by SeaSketch Team using POEDITOR

* The project will use the one big SSN POEDITOR project.  This is so that translators only have to go to one project to translate strings for all languages.
* Developer will configure POEDITOR project ID and Key environment variables.
* Developer will use all translation CLI commands (extract, import, publish, sync)
* namespaces.json `import` will be set to `['gp', 'gp-testo']` namespaces. This will ensure non-en languages get imported on every import or sync for both core and project-specific translations.
* namespaces.json `publish` will be left at `['gp-testo']` so that core translations are not published back to the main project.
* As developer edits reports/components that were installed on init from template, they should maintain the `gp` namespace, as long as no part of the string to translate changes.  If it changes, then the namespace should switch to the project namespace (e.g. `gp-testo`).  On the next `translation:extract` the string will then get moved to the new namespace, and on the next `translation:import` it will get published to the `gp-testo` tag in POEDITOR to be re-translated for all languages, and then translations for other languages will get imported back to the project on next `translation:import`.
  * Why not switch the whole component (all translated strings) from the `gp` namespace over to the project namespace if one string gets changed?  Because that will force extra re-translation.  (may reconsider).
  * Failure to switch away from the `gp` namespace means your string won't get published to poeditor for translation, because the `gp` namespace is not a published namespace for this use case.
  * There may need to be multiple useTranslation(ns) calls within a single component, if there are strings for more than one namespace.  Rename the t function as needed to differentiate.
* Translator will use POEDITOR and they will filter by `gp` tag for core translations, and by `gp-testo` tag for project translations.

### 2. Reports developed by external developer using POEDITOR

* The user will create their own POEDITOR project and get the environment variables for project and api key setup.
* If POEditor free account does not suffice, then if you make the report code public and open source, then you can request upgrade to a free premium account in POEditor interface.
* namespaces.json `import` will be set to `['gp', 'gp-testo']` namespaces.  This will ensure updated translations for non-en languages get imported on every import or sync for both core and project-specific translations.
* namespaces.json `publish` will be set to `['gp', 'gp-testo']` so that core and project translations are published to the new POEDITOR project making it the source of truth.  There will be no connection to the SSN POEDITOR project.
* As developer edits reports/components that were installed on init from template, they should maintain the `gp` namespace for strings that already had it for consistency.  This will ensure existing translations for other languages are not lost.
  * In this situation, there may need to be multiple useTranslation(ns) calls within a single component, if there are strings for more than one namespace.  Rename the t function as needed to differentiate.
  * Alternatively, `useTranslation` calls can leave off the namespace parameter and it will return all translations, but use of the `t()` function will need to be sure and set a namespace for each translated string that needs to maintain one.  This only works for projects maintained in their own POEditor project.
* Translator will use POEDITOR to translate, and they will not need to filter by tag because all strings should be reviewed.

### 3. Reports developed by external developer not using POEDITOR but in local repo

* Translations will be managed within the `testo` reports code repo.
* Developer will remove/disable `import` and `publish` commands from projects package.json
* As developer edits reports/components that were installed on init from template, if a string is edited that has the `gp` namespace, it should just keep it.  This will ensure existing translations for other languages are not lost.
* As developer creates new reports/components it will add them to the project namespace.
* Translator will need a workflow for translating the strings.  They could use vscode and `i18n-ally` extension directly.  A separate translation service could also be integrated other than POEditor.
