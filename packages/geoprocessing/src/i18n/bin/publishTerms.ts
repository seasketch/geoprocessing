/* eslint-disable i18next/no-literal-string */
import * as request from "request";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import config from "../config.json";

const post = promisify(request.post);

/**
 * Pushes all terms for english language to POEditor, updating any existing translations.
 * If you make local changes to the translation files, make sure you run this after importTerms.ts
 * so that POEditor is the source of truth.
 */
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
  }[] = data.result.terms.filter((t) => t.context === config.remoteContext);
  console.log(
    `Publishing '${config.localNamespace}' namespace strings with context '${config.remoteContext}'`
  );
  console.log(
    "publishedTerms",
    publishedTerms.map((pt) => pt.term)
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

  for (const namespace of [config.localNamespace]) {
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

  console.log(
    "termsToUpdate",
    termsToUpdate.map((t) => t.term)
  );
  console.log(
    "enTranslationsToUpdate",
    enTranslationsToUpdate.map((t) => t.term)
  );
  console.log(
    "termsToAdd",
    termsToAdd.map((t) => t.term)
  );

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

    // Update their english translations
    if (enTranslationsToUpdate.length > 0) {
      const updatedTranslations = await post({
        url: `https://api.poeditor.com/v2/translations/update`,
        form: {
          api_token: process.env.POEDITOR_API_TOKEN,
          id: process.env.POEDITOR_PROJECT,
          language: "en",
          data: JSON.stringify(
            enTranslationsToUpdate
              .filter((t) => t.english?.length)
              .map((t) => ({
                term: t.term,
                context: t.context,
                translation: {
                  content: t.english,
                },
              }))
          ),
        },
      });
      const updatedTranslationData = JSON.parse(updatedTranslations.body);
      if (updatedTranslationData.response.status !== "success") {
        throw new Error(
          `API response was ${updatedTranslationData.response.status}`
        );
      } else {
        console.log(
          `updated en translations for ${updatedTranslationData.result.translations.updated} terms`
        );
      }
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

    // Add their english translations
    const addedTranslations = await post({
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
              context: t.context,
              translation: {
                content: t.english,
              },
            }))
        ),
      },
    });
    data = JSON.parse(addedTranslations.body);

    if (data.response.status !== "success") {
      throw new Error(`API response was ${data.response.status}`);
    } else {
      console.log(
        `added en translations for ${data.result.translations.added} terms`
      );
    }
  }

  if (termsToAdd.length === 0 && termsToUpdate.length === 0) {
    console.log("No new or updated terms.");
  }
})();
