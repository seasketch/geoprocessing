#!/usr/bin/env node
/* eslint-disable i18next/no-literal-string */
import * as request from "request";
import fs from "fs-extra";
import * as path from "path";
import { promisify } from "util";
import config from "../config.json";
import { Translations } from "./publishTerms";

const post = promisify(request.post);
const get = promisify(request.get);

/**
 * Pulls all terms for all languages from POEditor and writes them to the local translation files.
 * This will overwrite any existing translations.
 */
(async () => {
  const res = await post({
    url: `https://api.poeditor.com/v2/terms/list`,
    form: {
      api_token: process.env.POEDITOR_API_TOKEN,
      id: process.env.POEDITOR_PROJECT,
      language: "en",
      context: config.remoteContext,
    },
  });
  let data = JSON.parse(res.body);
  if (data.response.status !== "success") {
    throw new Error(`API response was ${data.response.status}`);
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
  }[] = data.result.terms;
  enTerms.sort((a, b) => a.term.localeCompare(b.term));
  console.log(
    `Importing strings with context '${config.remoteContext}' to namespace '${config.localNamespace}'`
  );
  const { statusCode, body } = await post({
    url: `https://api.poeditor.com/v2/languages/list`,
    form: {
      api_token: process.env.POEDITOR_API_TOKEN,
      id: process.env.POEDITOR_PROJECT,
    },
  });
  data = JSON.parse(body);
  if (data.response.status !== "success") {
    throw new Error(`API response was ${data.response.status}`);
  }
  const languages = data.result.languages as {
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
    const { statusCode, body } = await post({
      url: `https://api.poeditor.com/v2/projects/export`,
      form: {
        api_token: process.env.POEDITOR_API_TOKEN,
        id: process.env.POEDITOR_PROJECT,
        language: curLang.code,
        type: "key_value_json",
        filters: "translated",
        order: "terms",
      },
    });
    data = JSON.parse(body);
    if (data.response.status !== "success") {
      throw new Error(`API response was ${data.response.status}`);
    }
    const translationsResponse = await get(data.result.url);
    const remoteTranslations = JSON.parse(translationsResponse.body);

    const localePath = path.join(__dirname, "../lang", curLang.code);

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
