# Internationalization (i18n)

Geoprocessing Improvement Proposal 1

## Glossary

i18n - shorthand name for Internationalization.
Term - A unique string to be translated. Typically it will be the exact string to translate in English language, or it may just be a descriptor.

## Requirements

Overall:

- Should support all languages supported by SeaSketch Next including right-to-left (RTL) languages.
- Both the core geoprocessing library, and individual geoprocessing projects that use it should support translation.
- Geoprocessing projects should be able to build on base translations provided for library UI components, but still be managed independently.
- At runtime, reports will default to english language.
- The SeaSketch platform (via iFrame postMessage) will dictate which language is loaded initially, and be able to change the language.
- If a language is provided that the geoprocessing library or project does not support then it should fallback to English.

Geoprocessing library:

- Core UI components should be 100% translated for all languages.
- The source code will be the source of truth for all terms to be translated, and their English translations, with the exception of specially handled plural terms.
- Terms, and their English translation will mostly be extracted from the source code in an automated process. A manual process may be used for special cases like handling plural terms.
- The geoprocessing library will manage translations for non-english languages for its core UI components and templates using the [POEditor](https://poeditor.com) platform. POEditor will be the source of truth for these translations.
- Terms/English translations from geoprocessing library code and translated strings from POEditor will be brought together into a single bundle of `base` translations, where they will be mainted in the library git repository.

Geoprocessing projects:

- Geoprocessing projects will install and use the `base` translations from the geoprocessing library for all core UI components and templates used in reports.
- `base` terms/translations will be kept separate from project terms/translations in POEditor, as well as in the project. This will ensure that base translations can be upgraded, without affecting project translations. It will also allow project-specific translations to be customized, without losing the base translations.
- `base` and project terms/translations should be merged at runtime to provide all of the terms/translations needed for the reports, which will be a mix of core and custom components. If a term exists in both the `base` and `project` translation bundle, the project translation will win.
- Geoprocessing projects will manage all other terms and translations for custom reports, using the same workflow as the geoprocessing library.
- Geoprocessing project report developers, who are independent of the SeaSketch team, should be able to manage translations in their own POEditor project, just by changing their access credentials.
- Report developers independent of the SeaSketch team should also have the option to manage translations entirely within the code repo, without using a translation service like POEditor.
- Translators will be invited to the appropriate POEditor project to review and update any and all translations for their language(s) of expertise.

## Implementation

- A single POEditor project will be used to manage both `base` and `project` terms and translations.
- `base` terms and translations will be kept separate from project terms and translations in POEditor using `context`. Context allows the same term string value to be duplicated in POEditor, with different translations for each.

CLI commands will be the main way developers work with translations.

- `extract:translation`
  - extracts all translations using babel and [babel-plugin-i18next-extract](https://github.com/gilbsgilbs/babel-plugin-i18next-extract).
- `publish:translation`
  - Posts translations for all languages to POEDITOR
  - Behavior is configured via `src/i18n/config.ts`. Translations with namespace specified by `localNamespace` are written to POEditor with context value specified by `remoteContext`.
  - All english translations are published, overwriting any in POEditor, since the code is their source of truth.
  - For non-english languages, POEditor is the source of truth, so if a translation is not defined in POEditor, then a local project translation is published if available, to seed it the first time.
  - For GP projects, if a project translation is not available, then a base translation will be published as fallback if available. Running `import:translation` after that will then import those base translations back and seed the local project translations.
- `import:translation`
  - fetches translations from POEditor for all non-english languages having context value specified by `remotextContex` property in `src/i18n/config.son`. Any existing translation values will be overwritten. Translations are saved to the namespace specified by the `localNamespace` property in `project/i18n.json`.
- `sync:translation`
  - runs in succession `extract`, `publish`, then `import`.
- `install:translation` (available in gp project only)
  - copies base translations from the installed geoprocessing library to the projects `src/i18n/baseLang` directory, overwriting any previous version.

Configuration files:

- A `i18n/supported.ts` file will contain all supported languages, with a unique language code for each. When POEditor is used, then languages get added there as well for each one.
- An `project/i18n.json` file will be used to map the local i18n data model (e.g. keys, namespaces) to those of POEditor (terms, context. Specifically it dictates which local i18n namespace to extract translations from (defaults to `translation`), and which remote POEditor context to publish terms/translations to, and import terms/translations from. The `remoteContext` value will vary. For the core geoprocessing library the context will be set to `base` and for geoprocessing project it will be set to the name of the project, as defined in package.json. For example:

geoprocessing library internal i18n.json:

```json
{
  "localNamespace": ["translation"],
  "remoteContext": ["base"]
}
```

i18n.json file for geoprocessing project called `fsm-reports`:

```json
{
  "localNamespace": ["translation"],
  "remoteContext": ["fsm-reports"]
}
```

For geoprocessing library:

- On build of the geoprocessing library, the i18n directory will be copied into the dist folder as part of the base-project.
- CLI commands will live at the root of the monorepo and work on all translatable strings in the `geoprocessing` package, as well as all `template-*` packages.
- Translations will be maintained in `packages/geoprocessing/src/i18n`
- On publish, always push all local English translations. For all non-english langauges, push translations if it doesn't already exist in POEditor.
- Prior to every release of the library, UI text string (terms) will need to get updated in POEditor and translated for all languages.

For geoprocessing projects:

- CLI commands will live at the root of the project.
- When creating a new geoprocessing project, the `base` translations for the current version of the gp library are installed to the project at `src/i18n/baseLang`. Report developers should not edit this.
- Report developers working on a geoprocessing project will need to make sure that they keep their base translations up to date. They do this by running `npm run extract:translation`.
- Project translations are managed alongside base translations under `src/i18n/lang`. These can be edited but typically will be done via CLI commands (see use cases below).
- When initially created, each geoprocessing project will have `base` translations installed.
- On publish, always push all local English translations. For all non-english langauges, push translations if it doesn't already exist in POEditor. Additionally, for all languages, if there is no local project translation, fallback to base translation if it exists.
- Prior to a reports being used for planning, UI text strings( terms) will need to get published to POEditor, translated for the relevant subset of languages, then imported back into the library.

### Translations Within Library Templates

- `template-*` monorepo packages are essentially little geoprocessing projects. The only difference is Lerna symlink them to the sibling geoprocessing package on `npm install`. You can treat templates just like a geoprocessing project and use all available CLI commands from within the monorepo.
- However, since we chose to converge all i18n translations into the geoprocess packages, if we want translations to load in storybook for templates, you have to symlink the core geoprocessing i18n over to the template. Without that the storybook should still load but the translations will fail in error.
  - `ln -s packages/geoprocessing/src/i18n/ packages/template-ocean-eez/src/i18n

## Client-side language load and switch

- SSN will send a `language` property within `SeasketchReportingInitEvent` message.
- It will pass the same code used in [SSN](https://github.com/seasketch/next/blob/master/packages/client/src/lang/supported.ts).
- geoprocessing library will maintain its own version of that file in its i18n folder, and if SSN sends a code that's not supported it will gracefully fallback to the default language, with a console.warn
- SSN will also send a new message to change language - `SeaSketchReportingChangeLanguageEvent` if the user switches.
- App.tsx will read the language code from the postMessage event sent by SSN and store this in context. If there is a change language event, then this code stored in context will be updated. The language will default to `en` English and be updated with the initial language passed by SSN.
- A `useLanguage()` hook will be provided that provides access to the current language stored in context and will trigger an update when the language changes. It also offers a `changeLanguage()` function, to change the current language.
- each project client will load translations by wrapping a `Translator` react component, which creates an `i18n` instance (using i18nAsync.ts that lazy loads languages by default but i18nSync.ts is also available) and passes it in to `i18nextProvider`.
- There is one i18n instance for each report client so that they are isolated and multiple can be loaded in storybook, or even an app at once.
- The Translator will listen for language changes using the useLanguage hook. If it changes, it will tell the i18n instance to change it's language, which will load the appropriate resource file and all translations in the UI will update.

## Storybook

- A language switcher will be wrapped around all stories, allowing the language to be switched.
- Report clients will have a built-in Translator, but for UI components that don't, a Translator is wrapped in the story.
- Translations just work in storybook. Its webpack setup supports dynamic imports.

## Report development use cases

### For all report development use cases

- As developer creates new reports, they will wrap all strings destined to be displayed in the UI in translate functions using react-i18n such as `t()`, `<Trans>` etc.
- A `namespace` should not be defined for these strings.
- A unique `key` typically does need to be defined for these strings, as the key will default to the english string.

### 1. Reports developed by SeaSketch Team using POEDITOR

- Developer will configure POEDITOR project ID and Key environment variables.
- Developer will use all translation CLI commands (extract, import, publish, sync)
- Translator will filter by context as needed to just the terms they need to translate.

### 2. Reports developed by external developer using POEDITOR

- The user will create their own POEDITOR project and get the environment variables for project and api key setup.
- If POEditor free account does not suffice, then if you make the report code public and open source, then you can request upgrade to a free premium account in POEditor interface.
- Translator will use POEDITOR to translate, and they will not need to filter by tag because all strings should be reviewed.

### 3. Reports developed by external developer not using POEDITOR but in local repo

- Developer will use `extract:translation` but not `import:translation` and `publish:translation`.
- Developer uses `i18n-ally` (which vscode settings are established for) to translate strings.
- A separate translation service could also be integrated other than POEditor.

## Language Translation Tutorial

The geoprocessign framework implements the GIP-1 proposal for language translation, and uses POEditor as its third-party service, allowing translators to more easily provide translations.

This is more formally known as `internationalization` or `i18n` for short which is a reference to the word internationalization being the letter `i` followed by 18 letters, then the letter `n`.

You do not need to complete this step unless you want to support language translation.

POEditor offers free translation for open source projects, but you are not required to use it. You can maintain your translations locally.

### Managing Translations Using POEditor

There are 4 commands you will commonly use in working with translations: `extract:translation`, `publish:translation`, `import:translation` and `sync:translation`. You can read more about them on the [CLI](/CLI.md) page.

When you `init` a new project it will automatically install the `src/i18n` directory and base translations from the geoprocessing library, and then run `extract:translation` to extract project-specific translation strings.

### Setup POEditor as a developer on the SeaSketch team

- Create a new account in [POEditor](https://poeditor.com/)
- Request an invite to the SeaSketch Reports project as an admin and verify you can access it.
- Follow the instructions below to setup API credentials

### Setup POEditor As An Independent Developer

- Create a new account in [POEditor](https://poeditor.com/)
- Create a new project in POEditor
- Request open source approval for project (unlocking unlimited free translations)
  - If your project is public and open source and you would like to unlock free translations you click dashboard -> project name -> Settings -> Advanced -> Open source project
- Follow the instructions below to setup API credentials

### Setup POEditor API credentials

- Setup your API credentials
  - Click gear icon in top right -> API Access in left sidebar
  - Note API token for your user
  - Note ID number for your project
  - Add credentials to your `.bashrc` file

```bash
nano ~/.bashrc

export POEDITOR_PROJECT=[YOUR_PROJECT_ID_NUMBER]
export POEDITOR_API_TOKEN=[YOUR_API_TOKEN]

Ctrl-O to save
Ctrl-X to exit
```

Now source the changes into to your current shell and verify the environment variables are set

```bash
source ~/.bashrc
echo $POEDITOR_PROJECT
echo $POEDITOR_API_TOKEN
```

### Publishing Translations to POEditor

Then `npm run publish:translation` to push the new/edited english strings to POEditor. The strings will be tagged in POEditor with the name of the project e.g the context for yours will be (`fsm-reports-test`).

![POEditor Context](assets/PoeditorContext.png "POEditor Context")

with Someone will then need to translate the strings using the POEditor service for each relevant language.

## Importing Translations from POEditor

You will then need to run `npm run import:translation` to bring these translations back into the project. You should see files added/updated for each language code in `src/i18n/lang`.

Commit all translation files, including English and non-english, to the code repository. These will be bundled into your production app.

## Managing Translations Locally

If you choose not to use POEditor then the easiest option is to maintain translations in your project code repository.

You will still use the `extract:translation` command to extract your strings.

You can then use the [i18n-ally](https://github.com/lokalise/i18n-ally) vscode extension to manage your translations. Your project already includes vscode settings for using this extension in `.vscode/settings.json`. Read the extension documentation to learn how to use for example the auto-translation feature.

## Deploying Translations

If your translations are working in storybook, then there is nothing more to do. Your translations in `src/i18n/lang` and the base translations used as a fallback in `src/i18n/baseLang` will be bundled automatically into your app and loaded asynchronously using the `Translator`

## Adding New Languages

If your project needs to add a new language that is not already supported, follow these steps:

- Add more new language codes to the `project/basic.json` languages array. The full set of available languages codes can be found in `src/i18n/languages.json`. The language codes should match what [SeaSketch uses](https://github.com/seasketch/next/blob/master/packages/client/src/lang/supported.ts).
- Make sure the language is defined in your POEditor project with the same language code.
- Translate the strings in POEditor to the new language.
- On your next run of `import:translation` a folder for the language will be added to `src/i18n/lang` and include a `translation.json` file with the strings that you translated in POEditor.

## Test report translations

When you run `storybook`, the story displayed will include a language switcher. If you created your project using a starter template, strings that are displayed in the user interface are already pre-translated and the top-level report client already includes a story with a `Translator` component. You should be able to change the language and the interface will update for all supported languages.

![Language Switcher](assets/StoryTranslation.png "Language Switcher")

## Making Report Strings Translatable

Once you start adding and customizing your reports, you will need to translate any new strings you introduce to be displayed in the user interface. To do this, you need to use [react-i18next](https://react.i18next.com/) to wrap those strings in a translator function call or `Trans` React component. Here are some examples:

Example of using `t()` function via `useTranslation` hook to translate a string:

```typescript
import React from "react";
import { useTranslation } from "react-i18next";
const TestComponent = () => {
  const { t } = useTranslation();
  const displayString = t("This is a test");

  return <p>{displayString}</p>;
};
```

Example of using `Trans` component to translate a string interspersed with html tags, and with a dynamic value.

```typescript
import React from "react";
import { Trans } from "react-i18next";

export const TestComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        📐
        <Trans i18nKey="TestComponent - area message">
          This sketch is{" "}
          <b>{{ area: Number.format(Math.round(data.area * 1e-6)) }}</b> square
          kilometers
        </Trans>
      </p>
    </div>
  );
};
```

Both `t()` and `Trans` can be used within the same file, whatever combination gets the job done. Notice that the `Trans` example includes an `i18nKey` property. This is useful for providing context for where this string is in the codebase, as you'll soon see in the extracted strings. You can do the same thing with the `t` functions using `t('myKey', 'stringValue')`.

Once you've added new strings to your component or edited existing ones, and wrapped them in translation calls, you will then need to run `npm run extract:translation`. You should then see all new/changed english string updated in `src/i18n/lang/en/translation.json`. Here's an example project and its [translations](https://github.com/seasketch/azores-nearshore-reports/blob/main/src/i18n/lang/en/translation.json)

Here is what should be the resulting extracted strings for translation:

```json
"This is a test": "This is a test"
"TestComponent - area message": "This sketch is <2>{{area}}</2> square kilometers",
```

Notice that the second string has a translation key (`"TestComponent - area message"`) that is different from its value. Also notice that `This is a test` has the same key and value for it's translation pair. This is because we specified an `i18nkey` in the `Trans` component, and we didn't specify a key for the `t()` example, but we could have using `t("myKey", "myValue")`.

The benefit of not specifying a key and letting it be the same as the value is that anywhere you translate this same string in your codebase, they will all use one translation. If you specify a different key for every time you translate the same string, you will have to translate each one, causing some duplicate work for your translator. But the benefit of specifying a key is that it can give you context for where the string is used in your code. Based on this behavior, the recommended best practice is:

- If you have a string that is likely to be reused across your reports (think "metric", "protected area" or "planning area") then don't include a key when you wrap it in a translation.
- Andy if you have strings that you know are very specific to your report, usually sentences or paragraphs, then you can include a key to help with grouping your strings in your translation file. One method is to use the name of the component in the key and then a short bit about what the string is you're translating. (e.g. `SizeCard - learn more`)

`react-i18n` includes much more [advanced capabilities](https://react.i18next.com/latest/using-with-hooks) for translating complex strings, and you should use them as needed. This includes the use of `i18n` namespaces, which this framework has specifically chosen _`not`_ to use for simplicity to the user.

## Making Stories Translatable

Storybook includes a language switcher for testing out your translations, you just need to add a couple of pieces to your stories to make use of it. Any report client installed with the starter template will already include these pieces and you can refer to them. That said, in order for the storybook language switcher to work you need to:

- Wrap your story in a Translator, unless the component you're writing a story for already has its own Translator (e.g. report clients).
- Export your story component using a `ReportDecorator`
- Or if you want to override parts of the default ReportContext value used by the story you should export your story using `createReportDecorator()` instead.

Example story using default context:

```typescript
import React from "react";
import TestTable from "../TestTable";
import { ReportDecorator } from "../storybook/ReportDecorator";
import Translator from "../i18n/TranslatorAsync";

export const basic = () => (
  <Translator>
    <TestTable />
  </Translator>
);

export default {
  component: TestTable,
  title: "Components/TestTable",
  decorators: [ReportDecorator],
};
```

Example story overriding parts of report context with:

```typescript
import React from "react";
import { SizeCard } from "./SizeCard";
import {
  createReportDecorator,
  sampleSketchReportContextValue,
} from "@seasketch/geoprocessing/client-ui";
import Translator from "../components/TranslatorAsync";

const contextValue = sampleSketchReportContextValue({
  visibleLayers: [],
  exampleOutputs: [
    {
      functionName: "boundaryAreaOverlap",
      sketchName: "My Sketch",
      results: {
        metrics: [
          {
            metricId: "boundaryAreaOverlap",
            sketchId: "abc123",
            classId: "eez",
            groupId: null,
            geographyId: null,
            value: 75066892447.21024,
            extra: {
              sketchName: "fsm-east-west-sketch",
            },
          },
        ],
        sketch: {
          type: "Feature",
          properties: {
            name: "fsm-east-west-sketch",
            updatedAt: "2022-11-17T10:02:53.645Z",
            sketchClassId: "123abc",
            id: "abc123",
          },
          geometry: null,
        },
      },
    },
  ],
});

// Wrap in Translator to allow translations to work in storybook without report client
export const basic = () => (
  <Translator>
    <SizeCard />
  </Translator>
);

export default {
  component: SizeCard,
  title: "Project/Components/SizeCard",
  decorators: [createReportDecorator(contextValue)],
};
```
