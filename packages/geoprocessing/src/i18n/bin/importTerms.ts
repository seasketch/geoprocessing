#!/usr/bin/env node
/* eslint-disable i18next/no-literal-string */
import fs from "fs-extra";
import * as path from "path";
import { Translations } from "./publishTerms.js";

if (!process.env.POEDITOR_API_TOKEN) {
  throw new Error("POEDITOR_API_TOKEN is not defined");
}
if (!process.env.POEDITOR_PROJECT) {
  throw new Error("POEDITOR_PROJECT is not defined");
}

const installedProjectPath = path.join("project"); // assumes script running from top-level
const monoProjectPath = path.join("packages/geoprocessing/src/project");

const projectPath = (() => {
  if (fs.existsSync(installedProjectPath)) {
    console.log(`Found project path at ${installedProjectPath}`);
    return installedProjectPath;
  } else if (fs.existsSync(monoProjectPath)) {
    console.log(`Found project path at ${monoProjectPath}`);
    return monoProjectPath;
  }
  throw new Error(
    `Could not find path to project dir, tried ${installedProjectPath} and ${monoProjectPath}`
  );
})();

const config = await fs.readJSON(`${projectPath}/i18n.json`);

/**
 * Pulls all terms for all languages from POEditor and writes them to the local translation files.
 * This will overwrite any existing translations.
 */
(async () => {
  const enTermsForm = new FormData();
  enTermsForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
  enTermsForm.append("id", process.env.POEDITOR_PROJECT!);
  enTermsForm.append("language", "en");
  enTermsForm.append("context", config.remoteContext);

  const enTermsResponse = await fetch(
    "https://api.poeditor.com/v2/terms/list",
    {
      method: "POST",
      body: enTermsForm,
    }
  );

  const enTermsResult = await enTermsResponse.json();

  if (enTermsResult.response.status !== "success") {
    throw new Error(`API response was ${enTermsResult.response.status}`);
  }
  const enTerms: {
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
  }[] = enTermsResult.result.terms;
  enTerms.sort((a, b) => a.term.localeCompare(b.term));

  console.log(
    `Importing strings with context '${config.remoteContext}' to namespace '${config.localNamespace}'`
  );
  const langForm = new FormData();
  langForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
  langForm.append("id", process.env.POEDITOR_PROJECT!);

  const langResponse = await fetch(
    `https://api.poeditor.com/v2/languages/list`,
    {
      method: "POST",
      body: langForm,
    }
  );

  const langResult = await langResponse.json();
  if (langResult.response.status !== "success") {
    throw new Error(`API response was ${langResult.response.status}`);
  }
  const languages = langResult.result.languages as {
    name: string;
    code: string;
    percentage: number;
  }[];

  for (const curLang of languages.filter((curLang) => curLang.code !== "en")) {
    if (curLang.percentage === 0) {
      console.log(
        `${curLang.code}: skipping ${curLang.name} (${curLang.percentage}% translated)`
      );
      continue;
    }
    console.log(
      `${curLang.code}: importing ${curLang.name} (${curLang.percentage}% translated)`
    );

    const curLangInfoForm = new FormData();
    curLangInfoForm.append("api_token", process.env.POEDITOR_API_TOKEN!);
    curLangInfoForm.append("id", process.env.POEDITOR_PROJECT!);
    curLangInfoForm.append("language", curLang.code);
    curLangInfoForm.append("type", "key_value_json");
    curLangInfoForm.append("filters", "translated");
    curLangInfoForm.append("order", "terms");

    const curLangInfoResponse = await fetch(
      `https://api.poeditor.com/v2/projects/export`,
      {
        method: "POST",
        body: curLangInfoForm,
      }
    );

    const projectsResult = await curLangInfoResponse.json();

    if (projectsResult.response.status !== "success") {
      throw new Error(`API response was ${projectsResult.response.status}`);
    }
    const translationsResponse = await fetch(projectsResult.result.url);
    const remoteTranslations = await translationsResponse.json();

    const localePath = path.join(import.meta.dirname, "../lang", curLang.code);

    const localTranslationsPath = `${localePath}/${config.localNamespace}.json`;
    const localTranslations: Translations = (() => {
      if (fs.existsSync(localTranslationsPath)) {
        const transTerms = fs.readJsonSync(localTranslationsPath);
        return transTerms;
      } else {
        if (fs.existsSync(path.dirname(localTranslationsPath)) === false) {
          fs.mkdirSync(path.dirname(localTranslationsPath));
        }
        fs.writeJsonSync(localTranslationsPath, {});
        return {};
      }
    })();

    for (const enTerm of enTerms) {
      // Overwrite local translation with remote if one exists
      if (
        remoteTranslations[config.remoteContext] &&
        remoteTranslations[config.remoteContext][enTerm.term] &&
        enTerm.context === config.remoteContext
      ) {
        localTranslations[enTerm.term] =
          remoteTranslations[config.remoteContext][enTerm.term];
      }
    }
    if (Object.keys(localTranslations).length > 0) {
      fs.rmSync(localePath, { recursive: true, force: true });
      fs.mkdirSync(localePath);
      // console.log("translated terms", translatedTerms);
      fs.writeJsonSync(localTranslationsPath, localTranslations, {
        spaces: 2,
      });
    }
  }
})();
