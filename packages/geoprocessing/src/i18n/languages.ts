export interface LangDetails {
  /** language name in English */
  name: string;
  /** language name in that language */
  localName?: string;
  /** language code, as defined in poeditor */
  code: string;
  /** is language direction right-to-left */
  rtl?: boolean;
}
