let fixtures: any = {};

export interface HumanUse {
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

export interface Ranked {
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

export default {
  ranked,
  humanUse,
};
