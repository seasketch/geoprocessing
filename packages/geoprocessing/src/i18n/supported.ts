export interface LangDetails {
  name: string;
  localName?: string;
  code: string;
  rtl?: boolean;
}

/**
 * List of languages that can be loaded.  Translations may exist for more than this.
 */
const languages: LangDetails[] = [
  { name: "English", localName: "English", code: "EN" },
  {
    name: "Portuguese",
    localName: "Portuguese",
    code: "pt",
  },
];

export default languages;
