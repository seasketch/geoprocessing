export interface LangDetails {
  name: string;
  localName?: string;
  code: string;
  rtl?: boolean;
}

const languages: LangDetails[] = [
  { name: "English", localName: "English", code: "EN" },
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
    code: "chk",
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
];

export default languages;
