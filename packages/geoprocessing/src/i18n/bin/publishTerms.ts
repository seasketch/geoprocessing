import fs from "fs-extra";
import path from "node:path";
import languages from "../languages.json" with { type: "json" };
import extraTerms from "../extraTerms.json" with { type: "json" };
import { LangDetails } from "../languages.js";

export type Translations = Record<string, string>;

if (!process.env.POEDITOR_API_TOKEN) {
  throw new Error("POEDITOR_API_TOKEN is not defined");
}
if (!process.env.POEDITOR_PROJECT) {
  throw new Error("POEDITOR_PROJECT is not defined");
}

const installedProjectPath = path.join("project"); // assumes script running from top of gp project
const monoProjectPath = path.join("packages/geoprocessing/src/project"); // assumes script running from top of monorepo

const projectPath = (() => {
  if (fs.existsSync(installedProjectPath)) {
    console.log(`Found project path at ${installedProjectPath}`);
    return installedProjectPath;
  } else if (fs.existsSync(monoProjectPath)) {
    console.log(`Found project path at ${monoProjectPath}`);
    return monoProjectPath;
  }
  throw new Error(
    `Could not find path to project dir, tried ${installedProjectPath} and ${monoProjectPath}`,
  );
})();

// read project languages
let projectLanguages: LangDetails[] = languages;
if (fs.existsSync(`${projectPath}/basic.json`)) {
  const basic = fs.readJsonSync(`${projectPath}/basic.json`);
  if (basic.languages && Array.isArray(basic.languages)) {
    projectLanguages = languages.filter((l) =>
      basic.languages.includes(l.code),
    );
  } else {
    console.error(
      `Missing language codes in ${projectPath}/basic.json, run upgrade command to add`,
    );
    process.exit(1);
  }

  if (!basic.languages.includes("EN")) {
    console.error(
      'Expected "EN" to be included in the languages array in basic.json',
    );
    process.exit(1);
  }

  if (basic.languages.length < 1) {
    console.log(`No languages found to publish in ${projectPath}/basic.json`);
    process.exit(1);
  }
}

const config = await fs.readJSON(`${projectPath}/i18n.json`);

/**
 * Pushes all terms for english language to POEditor, updating any existing translations.
 * If you make local changes to the translation files, make sure you run this after importTerms.ts
 * so that POEditor is the source of truth.
 */

const numLanguages = projectLanguages.length;
console.log(
  `Publishing terms with context '${config.remoteContext}' to namespace '${config.localNamespace}' ${
    projectLanguages ? "for " + numLanguages + " languages" : ""
  } `,
);
console.log();

const localEnglishTerms = await publishEnglish();
await publishNonEnglish(localEnglishTerms);

/**
 * Publishes terms and english translations extracted from source code to POEditor,
 * updating if they already exist, and deprecating if they were removed.
 * The local i18n repository (and the code that extracts to it) is the source of truth for English and will always overwrite POEditor.
 * If base translations are present (gp project), then base translation will be used if a
 * local translation is not present for a given term.
 */
async function publishEnglish() {
  const enTermsForm = new FormData();
  enTermsForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
  enTermsForm.append("id", process.env.POEDITOR_PROJECT!);
  enTermsForm.append("language", "en");

  const enTermsResponse = await fetch(
    "https://api.poeditor.com/v2/terms/list",
    {
      method: "POST",
      body: enTermsForm,
    },
  );

  const enTermsResult = await enTermsResponse.json();

  if (enTermsResult.response.status !== "success") {
    throw new Error(`API response was ${enTermsResult.response.status}`);
  }
  const publishedTerms: {
    term: string;
    context: string;
    plural: string;
    created: string;
    updated: string;
    translation: {
      content: string;
      fuzzy: number;
      updated: string;
    };
    reference: string;
    tags: string[];
    comment: string;
    obsolete?: boolean;
  }[] = enTermsResult.result.terms.filter(
    (t: any) => t.context === config.remoteContext,
  );

  const termsToAdd: {
    term: string;
    context: string;
    english: string;
  }[] = [];
  const termsToUpdate: { term: string; context: string }[] = [];
  const enTranslationsToUpdate: {
    term: string;
    english: string;
    context: string;
  }[] = [];

  // Read terms for current namespace from English translation file
  // Also merge in extraTerms (terms that are not extracted from source code)
  const localTerms = {
    ...fs.readJsonSync(
      path.join(
        import.meta.dirname,
        `../lang/en/${config.localNamespace.replace(":", "/")}.json`,
      ),
    ),
    ...extraTerms,
  } as Translations;

  // Compare local term to published term and track what needs to be updated
  for (const localTermKey in localTerms) {
    // Find matching published term
    const publishedTerm = publishedTerms.find((t) => t.term === localTermKey);
    if (publishedTerm) {
      // update this term
      publishedTerm.obsolete = false;
      if (publishedTerm.context === config.remoteContext) {
        termsToUpdate.push(publishedTerm);
        // and if english translation changed, update that also
        if (publishedTerm.translation.content !== localTerms[localTermKey]) {
          enTranslationsToUpdate.push({
            term: localTermKey,
            english: localTerms[localTermKey],
            context: config.remoteContext,
          });
        }
      }
    } else {
      // add this term
      termsToAdd.push({
        term: localTermKey,
        english: localTerms[localTermKey],
        context: config.remoteContext,
      });
    }
  }

  // Tag obsolete terms making them easy to filter out, and remove obsolete tag if it's no longer obsolete
  for (const publishedTerm of publishedTerms) {
    if (publishedTerm.obsolete === true) {
      publishedTerm.tags.push("obsolete");
      termsToUpdate.push(publishedTerm);
    } else if (
      publishedTerm.obsolete === false &&
      publishedTerm.tags.includes("obsolete")
    ) {
      publishedTerm.tags = publishedTerm.tags.filter((t) => t !== "obsolete");
      termsToUpdate.push(publishedTerm);
    }
  }

  // update terms
  if (termsToUpdate.length) {
    const enTermsUpdateForm = new FormData();
    enTermsUpdateForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
    enTermsUpdateForm.append("id", process.env.POEDITOR_PROJECT!);
    enTermsUpdateForm.append("data", JSON.stringify(termsToUpdate));

    const enTermsUpdateResponse = await fetch(
      "https://api.poeditor.com/v2/terms/update",
      {
        method: "POST",
        body: enTermsUpdateForm,
      },
    );

    const enTermsUpdatedResult = await enTermsUpdateResponse.json();
    if (enTermsUpdatedResult.response.status === "success") {
      console.log(`en: updated ${termsToUpdate.length} terms in POEditor`);
    } else {
      throw new Error(
        `API response was ${enTermsUpdatedResult.response.status}`,
      );
    }

    // Update their english translations
    if (enTranslationsToUpdate.length > 0) {
      const updateTranslationsForm = new FormData();
      updateTranslationsForm.append(
        "api_token",
        process.env.POEDITOR_API_TOKEN!,
      );
      updateTranslationsForm.append("id", process.env.POEDITOR_PROJECT!);
      updateTranslationsForm.append("language", "en");
      updateTranslationsForm.append(
        "data",
        JSON.stringify(
          enTranslationsToUpdate
            .filter((t) => t.english?.length)
            .map((t) => ({
              term: t.term,
              context: t.context,
              translation: {
                content: t.english,
              },
            })),
        ),
      );

      const updatedTranslationsResponse = await fetch(
        "https://api.poeditor.com/v2/translations/update",
        {
          method: "POST",
          body: updateTranslationsForm,
        },
      );

      const updatedTranslationsResult =
        await updatedTranslationsResponse.json();
      if (updatedTranslationsResult.response.status === "success") {
        console.log(
          `en: updated translations for ${updatedTranslationsResult.result.translations.updated} terms`,
        );
      } else {
        console.log(JSON.stringify(updatedTranslationsResult.response));
        throw new Error(
          `API response was ${updatedTranslationsResult.response.status}`,
        );
      }
    }
  }

  // add new terms
  if (termsToAdd.length) {
    const addTermsForm = new FormData();
    addTermsForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
    addTermsForm.append("id", process.env.POEDITOR_PROJECT!);
    addTermsForm.append("language", "en");
    addTermsForm.append("data", JSON.stringify(termsToAdd));

    const addTermsResponse = await fetch(
      "https://api.poeditor.com/v2/terms/add",
      {
        method: "POST",
        body: addTermsForm,
      },
    );

    const addTermsResult = await addTermsResponse.json();
    if (addTermsResult.response.status === "success") {
      console.log(
        `en: published ${addTermsResult.result.terms.added} terms to POEditor`,
      );
    } else {
      throw new Error(`API response was ${addTermsResult.response.status}`);
    }

    // Add their english translations
    const addTranslationsForm = new FormData();
    addTranslationsForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
    addTranslationsForm.append("id", process.env.POEDITOR_PROJECT!);
    addTranslationsForm.append("language", "en");
    addTranslationsForm.append(
      "data",
      JSON.stringify(
        termsToAdd
          .filter((t) => t.english?.length)
          .map((t) => ({
            term: t.term,
            context: t.context,
            translation: {
              content: t.english,
            },
          })),
      ),
    );

    const addTranslationsResponse = await fetch(
      "https://api.poeditor.com/v2/translations/add",
      {
        method: "POST",
        body: addTranslationsForm,
      },
    );

    const addTranslationsResult = await addTranslationsResponse.json();

    if (addTranslationsResult.response.status === "success") {
      console.log(
        `en: published translations for ${addTranslationsResult.result.translations.added} terms to POEditor`,
      );
    } else {
      throw new Error(
        `API response was ${addTranslationsResult.response.status}`,
      );
    }
  }

  if (termsToAdd.length === 0 && termsToUpdate.length === 0) {
    console.log(`en: no new or updated terms.`);
  }

  return localTerms;
}

/**
 * Publishes non-english translations to POEditor, if they don't already exist.
 * POEditor, when used, is considered the source of truth for non-english and won't be overwritten
 * If base translations are present (gp project only), then base translation will be used if both
 * POEditor and local translation are not present for a given term.
 */
async function publishNonEnglish(localEnglishTerms?: Translations) {
  if (!localEnglishTerms) return;
  for (const curLang of projectLanguages) {
    if (curLang.code === "EN") continue;

    const curLangTermsForm = new FormData();
    curLangTermsForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
    curLangTermsForm.append("id", process.env.POEDITOR_PROJECT!);
    curLangTermsForm.append("language", curLang.code);

    const curLangTermsResponse = await fetch(
      "https://api.poeditor.com/v2/terms/list",
      {
        method: "POST",
        body: curLangTermsForm,
      },
    );

    const curLangTermsResult = await curLangTermsResponse.json();

    if (curLangTermsResult.response.status !== "success") {
      throw new Error(`API response was ${curLangTermsResult.response.status}`);
    }

    // Filter down to the terms with context we care about
    const publishedTerms: {
      term: string;
      context: string;
      plural: string;
      created: string;
      updated: string;
      translation: {
        content: string;
        fuzzy: number;
        updated: string;
      };
      reference: string;
      tags: string[];
      comment: string;
      obsolete?: boolean;
    }[] = curLangTermsResult.result.terms.filter(
      (t: any) => t.context === config.remoteContext,
    );

    // Read terms for current namespace from current language translation file.
    // If file doesn't exist, then stub it out
    const localTerms = (() => {
      const localTermPath = path.join(
        import.meta.dirname,
        `../lang/${curLang.code}/${config.localNamespace.replace(
          ":",
          "/",
        )}.json`,
      );
      if (fs.existsSync(localTermPath)) {
        return fs.readJsonSync(localTermPath) as Translations;
      } else {
        if (fs.existsSync(path.dirname(localTermPath)) === false) {
          fs.mkdirSync(path.dirname(localTermPath));
        }
        fs.writeJsonSync(localTermPath, {});
        return {};
      }
    })();

    if (Object.keys(localTerms).length === 0) {
      console.log(`${curLang.code}: no translations found`);
      continue;
    }

    const localBaseTerms = (() => {
      if (
        fs.existsSync(
          path.join(
            import.meta.dirname,
            `../baseLang/${curLang.code}/${config.localNamespace.replace(
              ":",
              "/",
            )}.json`,
          ),
        )
      ) {
        return fs.readJsonSync(
          path.join(
            import.meta.dirname,
            `../baseLang/${curLang.code}/${config.localNamespace.replace(
              ":",
              "/",
            )}.json`,
          ),
        ) as Translations;
      } else {
        return {};
      }
    })();

    // For every english term, find translations that need to be added (don't already exist in POEditor),
    // or updated (are empty in POEditor and were probably cleared).
    const translationsToAdd: {
      term: string;
      translation: string;
      context: string;
    }[] = [];

    for (const enTermKey in localEnglishTerms) {
      // Find matching translated term in each repository
      const publishedTerm = publishedTerms.find((t) => t.term === enTermKey);
      const localTerm = localTerms[enTermKey];
      const localBaseTerm = localBaseTerms[enTermKey];

      // If published then skip, POEditor is source of truth
      if (
        publishedTerm &&
        publishedTerm.translation.content &&
        publishedTerm.translation.content.length > 0
      ) {
        continue;
      }

      // If local translation, add it, else fallback to base translation
      if (localTerm) {
        translationsToAdd.push({
          term: enTermKey,
          translation: localTerm,
          context: config.remoteContext,
        });
      } else if (localBaseTerm) {
        console.log(
          `${curLang.code}: using base translation for term ${enTermKey}`,
        );
        translationsToAdd.push({
          term: enTermKey,
          translation: localBaseTerm,
          context: config.remoteContext,
        });
      }
    }

    // Add translations for current language
    if (translationsToAdd.length > 0) {
      const addTranslationsForm = new FormData();
      addTranslationsForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
      addTranslationsForm.append("id", process.env.POEDITOR_PROJECT!);
      addTranslationsForm.append("language", curLang.code);
      addTranslationsForm.append(
        "data",
        JSON.stringify(
          translationsToAdd
            .filter((t) => t.translation?.length)
            .map((t) => ({
              term: t.term,
              context: t.context,
              translation: {
                content: t.translation,
              },
            })),
        ),
      );

      const addTranslationsResponse = await fetch(
        "https://api.poeditor.com/v2/translations/add",
        {
          method: "POST",
          body: addTranslationsForm,
        },
      );

      const addTranslationsResult = await addTranslationsResponse.json();

      if (addTranslationsResult.response.status === "success") {
        console.log(
          `${curLang.code}: published ${addTranslationsResult.result.translations.added} ${curLang.name} translations to POEditor`,
        );
      } else {
        throw new Error(
          `API response was ${JSON.stringify(addTranslationsResult.response)}`,
        );
      }
    } else {
      console.log(
        `${curLang.code}: no new ${curLang.name} translations to publish`,
      );
    }
  }
}
