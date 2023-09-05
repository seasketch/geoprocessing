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

const languages: LangDetails[] = [
  { name: "English", localName: "English", code: "EN" },
  ...[
    { name: "Spanish", localName: "Español", code: "es" },
    {
      name: "Dhivehi",
      localName: "ދިވެހި,",
      code: "dv",
      rtl: true,
    },
    {
      name: "Portuguese",
      localName: "Portuguese",
      code: "pt",
    },
    {
      name: "Norwegian",
      localName: "Norsk",
      code: "no",
    },
    {
      name: "Kosraean",
      localName: "Kosraean",
      code: "kos",
    },
    {
      name: "Samoan",
      localName: "Samoan",
      code: "sm",
    },
    {
      name: "Chuukese",
      localName: "Chuukese",
      code: "CHK",
    },
    {
      name: "Fijian",
      localName: "Na vosa vaka-Viti",
      code: "fj",
    },
    {
      name: "Fiji Hindi",
      localName: "फ़िजी हिंदी",
      code: "fh",
    },
    {
      name: "Hawaiian",
      localName: "ʻŌlelo Hawaiʻi",
      code: "haw",
    },
    {
      name: "French",
      localName: "Français",
      code: "fr",
    },
    {
      name: "German",
      localName: "Deutsch",
      code: "de",
    },
    {
      name: "Croatian",
      localName: "Hrvatski",
      code: "hr",
    },
    {
      name: "Afrikaans",
      localName: "Afrikaans",
      code: "af",
    },
    {
      name: "Chinese",
      localName: "中文",
      code: "zh-Hans",
    },
    {
      name: "Arabic",
      localName: "اَلْعَرَبِيَّةُ",
      code: "ar",
      rtl: true,
    },
    {
      name: "Dutch",
      code: "nl",
      localName: "Nederlands",
    },
    {
      name: "Italian",
      code: "it",
      localName: "Italiano",
    },
    {
      name: "Bulgarian",
      code: "bg",
      localName: "български",
    },
    {
      code: "fr-be",
      name: "French (Belgium)",
      localName: "Français (Belgique)",
    },
    {
      code: "el",
      name: "Greek",
      localName: "Ελληνικά",
    },
    {
      name: "Hindi",
      code: "hi",
      localName: "हिन्दी",
    },
    {
      name: "Indonesian",
      code: "id",
      localName: "Bahasa Indonesia",
    },
    {
      name: "Maori",
      code: "mi",
      localName: "Te Reo Māori",
    },
    {
      name: "Polish",
      code: "pl",
      localName: "Polski",
    },
    {
      name: "Romanian",
      code: "ro",
      localName: "Română",
    },
    {
      name: "Tongan",
      code: "to",
      localName: "lea fakatonga",
    },
    {
      name: "Zulu",
      code: "zu",
      localName: "isiZulu",
    },
    {
      name: "Swedish",
      code: "sv",
      localName: "Svenska",
    },
    {
      name: "Swedish (Finland)",
      code: "sv-fi",
      localName: "Svenska (Finland)",
    },
    {
      name: "Estonian",
      code: "et",
      localName: "Eesti",
    },
    {
      name: "Latvian",
      code: "lv",
      localName: "Latviešu",
    },
    {
      name: "Lithuanian",
      code: "lt",
      localName: "Lietuvių",
    },
    {
      name: "Russian",
      code: "ru",
      localName: "Русский",
    },
    {
      name: "Danish",
      code: "da",
      localName: "Dansk",
    },
  ].sort((a, b) => a.name.localeCompare(b.name)),
];

export default languages;
