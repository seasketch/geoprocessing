export interface LangDetails {
  name: string;
  localName?: string;
  code: string;
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
  ].sort((a, b) => a.name.localeCompare(b.name)),
];

export default languages;
