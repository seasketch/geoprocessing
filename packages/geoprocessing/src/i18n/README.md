# Localization

Contains localization machinery including:

- `bin` - scripts run by CLI commands at root of monorepo
- `lang` - bundled translations for each locale (language).  These are generated/updated via `extract`, and `import` translation commands.
- `supported.ts` - supported languages
- `plurals.json` - plural translated strings
- `i18n.ts` - loader for react app
