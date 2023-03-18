/* eslint-disable i18next/no-literal-string */
import * as request from "request";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import namespaces from "../namespaces.json";

const post = promisify(request.post);

(async () => {
  const res = await post({
    url: "https://api.poeditor.com/v2/terms/list",
    form: {
      api_token: process.env.POEDITOR_API_TOKEN,
      id: process.env.POEDITOR_PROJECT,
      language: "en",
    },
  });
  const data = JSON.parse(res.body);
  if (data.response.status !== "success") {
    throw new Error(`API response was ${data.response.status}`);
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
  }[] = data.result.terms;
  console.log(`Publishing namespaces ${namespaces.include.join(", ")}`);

  const termsToAdd: { term: string; tags: string[]; english: string }[] = [];
  const termsToUpdate: { term: string; tags: string[] }[] = [];

  for (const namespace of namespaces.include) {
    // Read terms for current namespace from English translation file
    const localTerms = JSON.parse(
      fs
        .readFileSync(
          path.join(__dirname, `../lang/en/${namespace.replace(":", "/")}.json`)
        )
        .toString()
    ) as {
      [key: string]: string;
    };

    // Loop through local terms and see if each already exists in published terms
    for (const localTermKey in localTerms) {
      const existingTerm = publishedTerms.find((t) => t.term === localTermKey);
      // console.log("localTermKey", localTermKey);
      // console.log(
      //   "existingTerm",
      //   existingTerm ? existingTerm.term : existingTerm
      // );
      if (existingTerm) {
        // update this term
        existingTerm.obsolete = false;
        if (existingTerm.tags.includes(namespace)) {
          existingTerm.tags.push(namespace);
          // console.log("update me!");
          termsToUpdate.push(existingTerm);
        }
      } else {
        // add this term
        // console.log("add me!", localTermKey);
        termsToAdd.push({
          term: localTermKey,
          english: localTerms[localTermKey],
          tags: [namespace],
        });
      }
    }
  }

  // Tag obsolete terms making them easy to filter out, and remove obsolete tag if it's no longer obsolete
  for (const publishedTerm of publishedTerms) {
    if (publishedTerm.obsolete === true) {
      publishedTerm.tags.push("obsolete");
      termsToUpdate.push(publishedTerm);
    } else if (
      publishedTerm.obsolete === false &&
      publishedTerm.tags.indexOf("obsolete") !== -1
    ) {
      publishedTerm.tags = publishedTerm.tags.filter((t) => t !== "obsolete");
      termsToUpdate.push(publishedTerm);
    }
  }

  // update terms
  if (termsToUpdate.length) {
    const updated = await post({
      url: `https://api.poeditor.com/v2/terms/update`,
      form: {
        api_token: process.env.POEDITOR_API_TOKEN,
        id: process.env.POEDITOR_PROJECT,
        data: JSON.stringify(termsToUpdate),
      },
    });
    const data = JSON.parse(updated.body);
    if (data.response.status !== "success") {
      throw new Error(`API response was ${data.response.status}`);
    } else {
      console.log(`updated ${termsToUpdate.length} terms`);
    }
  }

  // add new terms
  if (termsToAdd.length) {
    const { statusCode, body } = await post({
      url: `https://api.poeditor.com/v2/terms/add`,
      form: {
        api_token: process.env.POEDITOR_API_TOKEN,
        id: process.env.POEDITOR_PROJECT,
        data: JSON.stringify(termsToAdd),
      },
    });
    let data = JSON.parse(body);
    if (data.response.status !== "success") {
      throw new Error(`API response was ${data.response.status}`);
    } else {
      console.log(`added ${data.result.terms.added} terms`);
    }

    const translations = await post({
      url: `https://api.poeditor.com/v2/translations/add`,
      form: {
        api_token: process.env.POEDITOR_API_TOKEN,
        id: process.env.POEDITOR_PROJECT,
        language: "en",
        data: JSON.stringify(
          termsToAdd
            .filter((t) => t.english?.length)
            .map((t) => ({
              term: t.term,
              translation: {
                content: t.english,
              },
            }))
        ),
      },
    });
    data = JSON.parse(translations.body);

    if (data.response.status !== "success") {
      throw new Error(`API response was ${data.response.status}`);
    } else {
      console.log(
        `added default en translations for ${data.result.translations.added} terms`
      );
    }
  }

  if (termsToAdd.length === 0 && termsToUpdate.length === 0) {
    console.log("No new or updated terms.");
  }
})();
