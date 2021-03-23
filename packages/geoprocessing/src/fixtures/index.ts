import { randomInt, randomFloat } from "../util/randomData";

let fixtures: Record<string, object> = {};

export interface HumanUse extends Record<string, number | string> {
  name: string;
  count: number;
  perc: number;
}

const humanUse: HumanUse[] = [
  {
    name: "Motorboat, anchoring, swimming",
    count: 0,
    perc: 0.0,
  },
  {
    name: "Rec fishing from a self-propelled boat",
    count: 2,
    perc: 0.023,
  },
  {
    name: "Rec shell fishing, clamming",
    count: 1,
    perc: 0.115,
  },
  {
    name: "Scuba or snorkel from shore",
    count: 0,
    perc: 0.0,
  },
  {
    name: "Rec fishing from a motorboat",
    count: 4,
    perc: 0.045,
  },
  {
    name: "Commercial fishing",
    count: 0,
    perc: 0.0,
  },
  {
    name: "Motorboating, no anchoring",
    count: 1,
    perc: 0.018,
  },
  {
    name: "Surfing",
    count: 0,
    perc: 0.0,
  },
];

export interface Ranked extends Record<string, number | string> {
  value: number;
  percent: number;
  totalValue: number;
  rank: string;
  fullName: string;
}

const ranked: Ranked[] = [
  {
    value: 10,
    percent: 0.1,
    totalValue: 100,
    rank: "Low",
    fullName: "Cape St. James",
  },
  {
    value: 25,
    percent: 0.25,
    totalValue: 100,
    rank: "Medium",
    fullName: "South Moresby Trough",
  },
  {
    value: 40,
    percent: 0.2,
    totalValue: 200,
    rank: "Very High",
    fullName: "Cape St. James",
  },
  {
    value: 25,
    percent: 0.25,
    totalValue: 100,
    rank: "Medium",
    fullName: "Dogfish Bank",
  },
];

export interface Categorical extends Record<string, number | string> {
  id: string;
  count: number;
  low: number;
  med: number;
  high: number;
  comment: string;
}

export const getRandomCategorical = (): Categorical[] => {
  return [...Array(30)].map((r, index) => ({
    id: `${index + 1}`,
    count: randomInt(10000000),
    low: randomFloat(0, 0.2),
    med: randomFloat(0.3, 0.5),
    high: randomFloat(0.7, 0.9),
    comment: "This is a comment",
  }));
};

export default {
  ranked,
  humanUse,
  randomCategorical: getRandomCategorical(),
};
