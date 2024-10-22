# Creating a Report Client

To create a new report client simply run:

```bash
npm run create:client
```

Enter some information about this report client:

```
? Name for this client, in PascalCase ReefReport
? Describe what this client is for calculating reef overlap
? What is the name of geoprocessing function this client will invoke? (in camelCase) reefAreaOverlap
```

The command should then return the following output:

```
✔ created ReefReport client in src/clients/

Geoprocessing client initialized

Next Steps:
    * Update your client definition in src/clients/ReefReport.tsx
    * View your report client using 'npm storybook' with smoke test output for all geoprocessing functions
```

Assuming you named your client the default `SimpleReport`, it will have been been added to `project/geoprocessing.json` in the `clients` section. A `SimpleReport.tsx` file will have been added to `src/clients` folder. It is responsible for rendering your new `SimpleCard` component from the `src/components` folder and wrapping it in a language `Translator`. Think of the Card component as one section of a report. It executes a geoprocessing function and renders the results in a way that is readable to the user. You can add one or more Cards to your Report client. If your report gets too long, you can split it into multiple ReportPages. See the [TabReport](https://github.com/seasketch/geoprocessing/blob/dev/packages/template-blank-project/src/clients/TabReport.tsx) example of how to add a `SegmentControl` with multiple pages.

`SimpleReport.stories.tsx` and `SimpleCard.stories.tsx` files will both be included that allows you to view your Report and Card components in [storybook](#storybook) to dial in how they should render for every example sketch and their smoke test output.

After adding a report client, be sure to properly setup user displayed text for [translation](../gip/GIP-1-i18n.md#making-report-strings-translatable). You'll need to follow the full workflow to extract the english translation and add the translations for other languages.
