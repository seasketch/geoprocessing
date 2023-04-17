# GIP 1: i18n Localization

## Need

* Over half of SeaSketch projects would benefit from offering additional languages in reports.
* Of those, the number of languages to be translated for a given project can be 2-3, but never all.
* This means that core UI components should be 100% translated for all languages
* Project reports only will need translations for up to a few languages, but should get the base translations where already defined.

## Glossary

Term - A unique string to be translated.  Typically it will be the exact string to translate in English language, or it may just be a descriptor.

## Requirements

* The geoprocessing libary will support all languages supported by SeaSketch Next.
* The source code will be the source of truth for all terms to be translated, and their English translations, with the exception of specially handled plural terms.
* Terms, and their English translation will mostly be extracted from the source code in an automated process.  A manual process may be used for special cases like handling plural terms.
* The geoprocessing library will manage translations for non-english languages for its core UI components and templates using the [POEditor](https://poeditor.com) platform.  POEditor will be the source of truth for these translations.
* Terms/English translations from geoprocessing library code and translated strings from POEditor will be brought together into a single bundle of `base` translations, where they will be mainted in the library git repository.

Geoprocessing projects:

* Geoprocessing projects will install and use the `base` translations from the geoprocessing library for all core UI components and templates used in reports.
* `base` terms/translations will be kept separate from project terms/translations in POEditor, as well as in the project.  This will ensure that base translations can be upgraded, without affecting project translations.  It will also allow project-specific translations to be customized, without losing the base translations.
* `base` and project terms/translations should be merged at runtime to provide all of the terms/translations needed for the reports, which will be a mix of core and custom components.  If a term exists in both the `base` and `project` translation bundle, the project translation will win.
* Geoprocessing projects will manage all other terms and translations for custom reports, using the same workflow as the geoprocessing library.

* Geoprocessing project report developers, who are independent of the SeaSketch team, should be able to manage translations in their own POEditor project, just by changing their access credentials.
* Report developers independent of the SeaSketch team should also have the option to manage translations entirely within the code repo, without using a translation service like POEditor.
* Translators will be invited to the appropriate POEditor project to review and update any and all translations for their language(s) of expertise.

## Languages supported

* The geoprocessing library and projects will target all SeaSketch Next supported languages.  This will require coordination to keep them at parity.
* At runtime, reports will default to english language.
* The SeaSketch platform (via iFrame postMessage) will dictate which language is loaded initially, and be able to change the language.
* If a language is provided that the geoprocessing library or project does not support then it should fallback to English.

## Implementation

* A single POEditor project will be used to manage both `base` and `project` terms and translations.
* `base` terms and translations will be kept separate from project terms and translations in POEditor using `context`.  Context allows the same term string value to be duplicated in POEditor, with different translations for each.

CLI commands will be the main way developers work with translations.

* `translation:extract`
  * extracts all translations using babel and [babel-plugin-i18next-extract](https://github.com/gilbsgilbs/babel-plugin-i18next-extract).
* `translation:publish`
  * Posts translations for all languages to POEDITOR
  * Behavior is configured via `src/i18n/config.ts`.  Translations with namespace specified by `localNamespace` are written to POEditor with context value specified by `remoteContext`.
  * All english translations are published, overwriting any in POEditor, since the code is their source of truth.
  * For non-english languages, POEditor is the source of truth, so if a translation is not defined in POEditor, then a local project translation is published if available, to seed it the first time.
  * For GP projects, if a project translation is not available, then a base translation will be published as fallback if available.  Running `translation:import` after that will then import those base translations back and seed the local project translations.
* `translation:import`
  * fetches translations from POEditor for all non-english languages having context value specified by `remotextContex` property in `src/i18n/config.son`. Any existing translation values will be overwritten. Translations are saved to the namespace specified by the `localNamespace` property in `src/i18n/config.json`.
* `translation:sync`
  * runs in succession `extract`, `publish`, then `import`.
* `translation:install` (available in gp project only)
  * copies base translations from the installed geoprocessing library to the projects `src/i18n/baseLang` directory, overwriting any previous version.

Configuration files:

* A `i18n/supported.ts` file will contain all supported languages, with a unique language code for each.  When POEditor is used, then languages get added there as well for each one.
* An `i18n/config.json` file will be used to map the local i18n data model (e.g. keys, namespaces) to those of POEditor (terms, context.  Specifically it dictates which local i18n namespace to extract translations from (defaults to `translation`), and which remote POEditor context to publish terms/translations to, and import terms/translations from.  The `remoteContext` value will vary.  For the core geoprocessing library the context will be set to `base` and for geoprocessing project it will be set to the name of the project, as defined in package.json.  For example:

geoprocessing library internal config.json:

```json
{
  "localNamespace": [
    "translation"
  ],
  "remoteContext": [
    "base"
  ]
}
```

config.json for geoprocessing project called `fsm-reports`:

```json
{
  "localNamespace": [
    "translation"
  ],
  "remoteContext": [
    "fsm-reports"
  ]
}
```

For geoprocessing library:

* On build of the geoprocessing library, the i18n directory will be copied into the dist folder as part of the base-project.
* CLI commands will live at the root of the monorepo and work on all translatable strings in the `geoprocessing` package, as well as all `template-*` packages.
* Translations will be maintained in `packages/geoprocessing/src/i18n`
* On publish, always push all local English translations.  For all non-english langauges, push translations if it doesn't already exist in POEditor.
* Prior to every release of the library, UI text string (terms) will need to get updated in POEditor and translated for all languages.

For geoprocessing projects:

* CLI commands will live at the root of the project.
* When creating a new geoprocessing project, the `base` translations for the current version of the gp library are installed to the project at `src/i18n/baseLang`.  Report developers should not edit this.
* Report developers working on a geoprocessing project should not need to make sure that they keep their base translations up to date.  They should automatically upgrade on every run of `npm install` using the `prepare` command.
* Project translations are managed alongside base translations under `src/i18n/lang`.  These can be edited but typically will be done via CLI commands (see use cases below).
* When initially created, each geoprocessing project will have `base` translations installed.
* On publish, always push all local English translations.  For all non-english langauges, push translations if it doesn't already exist in POEditor.  Additionally, for all languages, if there is no local project translation, fallback to base translation if it exists.
* Prior to a reports being used for planning, UI text strings( terms) will need to get published to POEditor, translated for the relevant subset of languages, then imported back into the library.

### Translations Within Library Templates

* `template-*` monorepo packages are essentially little geoprocessing projects.  The only difference is Lerna symlink them to the sibling geoprocessing package on `npm install`.  You can treat templates just like a geoprocessing project and use all available CLI commands from within the monorepo.
* However, since we chose to converge all i18n translations into the geoprocess packages, if we want translations to load in storybook for templates, you have to symlink the core geoprocessing i18n over to the template.  Without that the storybook should still load but the translations will fail in error.
  * `ln -s packages/geoprocessing/src/i18n/ packages/template-ocean-eez/src/i18n

## Client-side language load and switch

* SSN will send a `language` property within `SeasketchReportingInitEvent` message.
* It will pass the same code used in [SSN](https://github.com/seasketch/next/blob/master/packages/client/src/lang/supported.ts).
* geoprocessing library will maintain its own version of that file in its i18n folder, and if SSN sends a code that's not supported it will gracefully fallback to the default language, with a console.warn
* SSN will also send a new message to change language - `SeaSketchReportingChangeLanguageEvent` if the user switches.
* App.tsx will read the language code from the postMessage event sent by SSN and store this in context.  If there is a change language event, then this code stored in context will be updated.  The language will default to `en` English and be updated with the initial language passed by SSN.
* A `useLanguage()` hook will be provided that provides access to the current language stored in context and will trigger an update when the language changes.  It also offers a `changeLanguage()` function, to change the current language.
* each project client will load translations by wrapping a `Translator` react component, which creates an `i18n` instance (using i18nAsync.ts that lazy loads languages by default but i18nSync.ts is also available) and passes it in to `i18nextProvider`.
* There is one i18n instance for each report client so that they are isolated and multiple can be loaded in storybook, or even an app at once.
* The Translator will listen for language changes using the useLanguage hook.  If it changes, it will tell the i18n instance to change it's language, which will load the appropriate resource file and all translations in the UI will update.

## Storybook

* A language switcher will be wrapped around all stories, allowing the language to be switched.
* Report clients will have a built-in Translator, but for UI components that don't, a Translator is wrapped in the story.
* Translations just work in storybook.  Its webpack setup supports dynamic imports.

## Report development use cases

### For all report development use cases

* As developer creates new reports, they will wrap all strings destined to be displayed in the UI in translate functions using react-i18n such as `t()`, `<Trans>` etc.
* A `namespace` should not be defined for these strings.
* A unique `key` typically does need to be defined for these strings, as the key will default to the english string.

### 1. Reports developed by SeaSketch Team using POEDITOR

* Developer will configure POEDITOR project ID and Key environment variables.
* Developer will use all translation CLI commands (extract, import, publish, sync)
* Translator will filter by context as needed to just the terms they need to translate.

### 2. Reports developed by external developer using POEDITOR

* The user will create their own POEDITOR project and get the environment variables for project and api key setup.
* If POEditor free account does not suffice, then if you make the report code public and open source, then you can request upgrade to a free premium account in POEditor interface.
* Translator will use POEDITOR to translate, and they will not need to filter by tag because all strings should be reviewed.

### 3. Reports developed by external developer not using POEDITOR but in local repo

* Developer will use `translation:extract` but not `translation:import` and `translation:publish`.
* Developer uses `i18n-ally` (which vscode settings are established for) to translate strings.
* A separate translation service could also be integrated other than POEditor.
