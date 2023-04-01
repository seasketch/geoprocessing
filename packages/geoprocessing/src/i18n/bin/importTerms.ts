#!/usr/bin/env node
/* eslint-disable i18next/no-literal-string */
import * as request from "request";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import config from "../config.json";

const post = promisify(request.post);
const get = promisify(request.get);

const INCLUDE_EMPTY_TERMS = false;

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
  const terms: {
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
  terms.sort((a, b) => a.term.localeCompare(b.term));
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

  for (const lang of languages.filter((curLang) => curLang.code !== "en")) {
    if (lang.percentage === 0) {
      console.log(`Skipping ${lang.name} (${lang.percentage}% translated)`);
    } else {
      console.log(`Importing ${lang.name} (${lang.percentage}% translated)`);
      const localePath = path.join(__dirname, "../lang", lang.code);
      if (fs.existsSync(localePath)) {
        fs.rmSync(localePath, { recursive: true, force: true });
      }
      const { statusCode, body } = await post({
        url: `https://api.poeditor.com/v2/projects/export`,
        form: {
          api_token: process.env.POEDITOR_API_TOKEN,
          id: process.env.POEDITOR_PROJECT,
          language: lang.code,
          type: "key_value_json",
          filters: "translated",
          order: "terms",
        },
      });
      data = JSON.parse(body);
      if (data.response.status !== "success") {
        throw new Error(`API response was ${data.response.status}`);
      }
      const translations = await get(data.result.url);
      const translated = JSON.parse(translations.body);

      fs.mkdirSync(localePath);

      const translatedTerms: { [term: string]: string } = {};
      for (const term of terms) {
        if (
          (translated[config.remoteContext][term.term] ||
            INCLUDE_EMPTY_TERMS) &&
          term.context === config.remoteContext
        ) {
          translatedTerms[term.term] =
            translated[config.remoteContext][term.term] || "";
        }
      }
      if (Object.keys(translatedTerms).length) {
        // console.log("translated terms", translatedTerms);
        fs.writeFileSync(
          path.join(
            localePath,
            `${config.localNamespace.replace(":", "/")}.json`
          ),
          JSON.stringify(translatedTerms, null, "  ")
        );
      }
    }
  }
})();
