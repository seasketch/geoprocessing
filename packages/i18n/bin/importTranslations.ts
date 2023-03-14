#!/usr/bin/env node
/* eslint-disable i18next/no-literal-string */
import * as request from "request";
import * as fs from "fs";
import * as path from "path";
const util = require("util");
const namespaces = require("../namespaces.json");
const post = util.promisify(request.post);
const get = util.promisify(request.get);

const INCLUDE_EMPTY_TERMS = false;

(async () => {
  const res = await post(`https://api.poeditor.com/v2/terms/list`, {
    form: {
      api_token: process.env.POEDITOR_API_TOKEN,
      id: process.env.POEDITOR_PROJECT,
      language: "en",
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
  console.log(`Publishing namespaces ${namespaces.include.join(", ")}`);
  const { statusCode, body } = await post(
    `https://api.poeditor.com/v2/languages/list`,
    {
      form: {
        api_token: process.env.POEDITOR_API_TOKEN,
        id: process.env.POEDITOR_PROJECT,
      },
    }
  );
  data = JSON.parse(body);
  if (data.response.status !== "success") {
    throw new Error(`API response was ${data.response.status}`);
  }
  const languages = data.result.languages as {
    name: string;
    code: string;
    percentage: number;
  }[];

  for (const lang of languages.filter((l) => l.code !== "en")) {
    if (lang.percentage === 0) {
      console.log(`Skipping ${lang.name} (${lang.percentage}% translated)`);
    } else {
      console.log(`Importing ${lang.name} (${lang.percentage}% translated)`);
      const basePath = path.join(__dirname, "../src/lang", lang.code);
      if (fs.existsSync(basePath)) {
        // @ts-ignore
        fs.rmSync(basePath, { recursive: true, force: true });
      }
      const { statusCode, body } = await post(
        `https://api.poeditor.com/v2/projects/export`,
        {
          form: {
            api_token: process.env.POEDITOR_API_TOKEN,
            id: process.env.POEDITOR_PROJECT,
            language: lang.code,
            type: "key_value_json",
            filters: "translated",
            order: "terms",
          },
        }
      );
      data = JSON.parse(body);
      if (data.response.status !== "success") {
        throw new Error(`API response was ${data.response.status}`);
      }
      const translations = await get(data.result.url);
      const translated = JSON.parse(translations.body);

      fs.mkdirSync(basePath);
      for (const namespace of namespaces.include) {
        const translatedTerms: { [term: string]: string } = {};
        for (const term of terms) {
          if (
            (translated[term.term] || INCLUDE_EMPTY_TERMS) &&
            term.tags.indexOf(namespace) !== -1
          ) {
            translatedTerms[term.term] = translated[term.term] || "";
          }
        }
        if (Object.keys(translatedTerms).length) {
          fs.writeFileSync(
            path.join(basePath, `${namespace.replace(":", "/")}.json`),
            JSON.stringify(translatedTerms, null, "  ")
          );
        }
      }
    }
  }
})();
