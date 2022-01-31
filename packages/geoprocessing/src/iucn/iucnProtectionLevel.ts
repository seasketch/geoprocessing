export const fullColor = "#BEE4BE";
export const highColor = "#FFE1A3";
export const lowColor = "#F7A6B4";

export interface IucnCategory {
  category: string;
  name: string;
  level: string;
}

export interface IucnCategoryCombined extends IucnCategory {
  allowedActivities: string[];
  categories?: { category: string; name: string }[];
}

export interface IucnActivity {
  id: string;
  name: string;
}

export type ActivityRankId = "yes" | "yesbut" | "no" | "nobut" | "variable";
export interface ActivityRank {
  id: ActivityRankId;
  desc: string;
  display: string;
}

export const activityRanks: Record<ActivityRankId, ActivityRank> = {
  no: {
    id: "no",
    desc: "No",
    display: "N",
  },
  nobut: {
    id: "nobut",
    desc:
      "Generally no, a strong prerogative against unless special circumstances apply",
    display: "N*",
  },
  yes: {
    id: "yes",
    desc: "Yes",
    display: "Y",
  },
  yesbut: {
    id: "yesbut",
    desc:
      "Yes because no alternative exists, but special approval is essential",
    display: "Y*",
  },
  variable: {
    id: "variable",
    desc:
      "Variable; depends on whether this activity can be managed in such a way that it is compatible with the MPA’s objectives",
    display: "*",
  },
};

export const iucnActivities = {
  RESEARCH_NE: { id: "RESEARCH_NE", display: "Research: non-extractive" },
  TRAD_USE_NE: {
    id: "TRAD_USE_NE",
    display: "Traditional use: non-extractive",
  },
  RESTORE_CON: {
    id: "RESTORE_CON",
    display: "Restoration/enhancement for conservation",
  },
  TRAD_FISH_COLLECT: {
    id: "TRAD_FISH_COLLECT",
    display: "Traditional fishing/collection",
  },
  RECREATE_NE: { id: "RECREATE_NE", display: "Non-extractive recreation" },
  TOURISM: { id: "TOURISM", display: "Large scale high intensity tourism" },
  SHIPPING: { id: "SHIPPING", display: "Shipping" },
  RESEARCH: { id: "RESEARCH", display: "Research: extractive" },
  RENEWABLE_ENERGY: {
    id: "RENEWABLE_ENERGY",
    display: "Renewable energy generation",
  },
  RESTORE_OTH: {
    id: "RESTORE_OTH",
    display: "Restoration/enhancement for other reasons",
  },
  FISH_COLLECT_REC: {
    id: "FISH_COLLECT_REC",
    display: "Fishing/collection: recreational (sustainable)",
  },
  FISH_COLLECT_LOCAL: {
    id: "FISH_COLLECT_LOCAL",
    display: "Fishing/collection: local fishing (sustainable)",
  },
  FISH_AQUA_INDUSTRIAL: {
    id: "FISH_AQUA_INDUSTRIAL",
    display: "Industrial fishing, industrial scale aquaculture",
  },
  AQUA_SMALL: { id: "AQUA_SMALL", display: "Aquaculture - small scale" },
  WORKS: { id: "WORKS", display: "Works (harbors, ports, dredging)" },
  UNTREATED_WATER: {
    id: "UNTREATED_WATER",
    display: "Untreated water discharge",
  },
  MINING_OIL_GAS: {
    id: "MINING_OIL_GAS",
    display: "Mining, oil and gas extraction",
  },
  HABITATION: { id: "HABITATION", display: "Habitation" },
};

export const iucnCategoriesList: Record<
  string,
  { category: string; level: string; name: string }
> = {
  "1a": { category: "1a", level: "full", name: "Strict Nature Reserve" },
  "1b": { category: "1b", level: "full", name: "Wilderness Area" },
  "2": { category: "2", level: "full", name: "National Park" },
  "3": { category: "3", level: "full", name: "Natural Monument/Feature" },
  "4": {
    category: "4",
    level: "high",
    name: "Habitat/Species Management Area",
  },
  "5": { category: "5", level: "high", name: "Protected Landscape/Seascape" },
  "6": {
    category: "6",
    level: "high",
    name: "Protected area with sustainable use",
  },
};
export const levels = ["full", "high", "low"];

export const iucnActivityCategories: Record<string, ActivityRankId[]> = {
  RESEARCH_NE: ["yesbut", "yes", "yes", "yes", "yes", "yes", "yes"],
  TRAD_USE_NE: ["yesbut", "yes", "yes", "yes", "yes", "yes", "yes"],
  RESTORE_CON: ["yes", "yes", "yes", "yes", "yes", "yes", "yes"],
  RECREATE_NE: ["no", "yes", "yes", "yes", "yes", "yes", "yes"],
  TRAD_FISH_COLLECT: ["no", "yesbut", "yes", "yes", "yes", "yes", "yes"],
  TOURISM: ["no", "no", "yes", "yes", "yes", "yes", "yes"],
  SHIPPING: ["no", "no", "nobut", "nobut", "yes", "yes", "yes"],
  RESEARCH: ["nobut", "nobut", "nobut", "nobut", "yes", "yes", "yes"],
  RENEWABLE_ENERGY: ["no", "no", "no", "no", "yes", "yes", "yes"],
  RESTORE_OTH: ["no", "no", "nobut", "nobut", "yes", "yes", "yes"],
  FISH_COLLECT_REC: ["no", "no", "no", "no", "variable", "yes", "yes"],
  FISH_COLLECT_LOCAL: ["no", "no", "no", "no", "variable", "yes", "yes"],
  FISH_AQUA_INDUSTRIAL: ["no", "no", "no", "no", "no", "no", "no"],
  AQUA_SMALL: ["no", "no", "no", "no", "variable", "yes", "yes"],
  WORKS: ["no", "no", "no", "no", "variable", "yes", "yes"],
  UNTREATED_WATER: ["no", "no", "no", "no", "no", "nobut", "nobut"],
  MINING_OIL_GAS: ["no", "no", "no", "no", "no", "no", "no"],
  HABITATION: ["no", "no", "no", "no", "no", "yes", "no"],
};

/** IUCN category definitions.  Note categories 2/3 and 4/6 have been merged because they have the same allowed uses */
export const iucnCategories: Record<string, IucnCategoryCombined> = {
  "1a": {
    category: "1a",
    level: "full",
    name: "Strict Nature Reserve",
    allowedActivities: ["RESEARCH_NE", "TRAD_USE_NE", "RESTORE_CON"],
  },
  "1b": {
    category: "1b",
    level: "full",
    name: "Wilderness Area",
    allowedActivities: [
      "RESEARCH_NE",
      "TRAD_USE_NE",
      "RESTORE_CON",
      "TRAD_FISH_COLLECT",
      "RECREATE_NE",
    ],
  },
  // "2": {
  //   category: "2",
  //   name: "National Park",
  //   allowedActivities: [
  //     "RESEARCH_NE",
  //     "TRAD_USE_NE",
  //     "RESTORE_CON",
  //     "TRAD_FISH_COLLECT",
  //     "RECREATE_NE",
  //     "TOURISM",
  //   ],
  // },
  // "3": {
  //   category: "3",
  //   name: "Natural Monument/Feature",
  //   allowedActivities: [
  //     "RESEARCH_NE",
  //     "TRAD_USE_NE",
  //     "RESTORE_CON",
  //     "TRAD_FISH_COLLECT",
  //     "RECREATE_NE",
  //     "TOURISM",
  //   ],
  // },
  "2/3": {
    category: "2/3",
    level: "full",
    name: "National Park or Natural Monument/Feature",
    allowedActivities: [
      "RESEARCH_NE",
      "TRAD_USE_NE",
      "RESTORE_CON",
      "TRAD_FISH_COLLECT",
      "RECREATE_NE",
      "TOURISM",
    ],
    categories: [
      {
        category: "2",
        name: "National Park",
      },
      {
        category: "3",
        name: "National Monument or Feature",
      },
    ],
  },
  "4/6": {
    category: "4/6",
    level: "high",
    name:
      "Habitat/Species Management Area or Protected area with sustainable use",
    allowedActivities: [
      "RESEARCH_NE",
      "TRAD_USE_NE",
      "RESTORE_CON",
      "TRAD_FISH_COLLECT",
      "RECREATE_NE",
      "TOURISM",
      "SHIPPING",
      "RESEARCH",
      "RENEWABLE_ENERGY",
      "RESTORE_OTH",
      "FISH_COLLECT_REC",
      "FISH_COLLECT_LOCAL",
      "AQUA_SMALL",
      "WORKS",
    ],
    categories: [
      {
        category: "4",
        name: "Habitat/Species Management Area",
      },
      {
        category: "6",
        name: "Protected area with sustainable use",
      },
    ],
  },
  // "4": {
  //   category: "4",
  //   name: "Habitat/Species Management Area",
  //   allowedActivities: [
  //     "RESEARCH_NE",
  //     "TRAD_USE_NE",
  //     "RESTORE_CON",
  //     "TRAD_FISH_COLLECT",
  //     "RECREATE_NE",
  //     "TOURISM",
  //     "SHIPPING",
  //     "RESEARCH",
  //     "RENEWABLE_ENERGY",
  //     "RESTORE_OTH",
  //     "FISH_COLLECT_REC",
  //     "FISH_COLLECT_LOCAL",
  //     "AQUA_SMALL",
  //     "WORKS",
  //   ],
  // },
  "5": {
    category: "5",
    level: "high",
    name: "Protected Landscape/Seascape",
    allowedActivities: [
      "RESEARCH_NE",
      "TRAD_USE_NE",
      "RESTORE_CON",
      "TRAD_FISH_COLLECT",
      "RECREATE_NE",
      "TOURISM",
      "SHIPPING",
      "RESEARCH",
      "RENEWABLE_ENERGY",
      "RESTORE_OTH",
      "FISH_COLLECT_REC",
      "FISH_COLLECT_LOCAL",
      "AQUA_SMALL",
      "WORKS",
      "HABITATION",
    ],
  },
  // "6": {
  //   category: "6",
  //   name: "Protected area with sustainable use of natural resources",
  //   allowedActivities: [
  //     "RESEARCH_NE",
  //     "TRAD_USE_NE",
  //     "RESTORE_CON",
  //     "TRAD_FISH_COLLECT",
  //     "RECREATE_NE",
  //     "TOURISM",
  //     "SHIPPING",
  //     "RESEARCH",
  //     "RENEWABLE_ENERGY",
  //     "RESTORE_OTH",
  //     "FISH_COLLECT_REC",
  //     "FISH_COLLECT_LOCAL",
  //     "AQUA_SMALL",
  //     "WORKS",
  //   ],
  // },
  None: {
    category: "None",
    level: "low",
    name: "None",
    allowedActivities: [
      "RESEARCH_NE",
      "TRAD_USE_NE",
      "RESTORE_CON",
      "TRAD_FISH_COLLECT",
      "RECREATE_NE",
      "TOURISM",
      "SHIPPING",
      "RESEARCH",
      "RENEWABLE_ENERGY",
      "RESTORE_OTH",
      "FISH_COLLECT_REC",
      "FISH_COLLECT_LOCAL",
      "FISH_AQUA_INDUSTRIAL",
      "AQUA_SMALL",
      "WORKS",
      "UNTREATED_WATER",
      "MINING_OIL_GAS",
      "HABITATION",
    ],
  },
};

export const categories = Object.keys(iucnCategories);

/**
 * Given list of allowed activities in the sketch, returns the highest category allowable
 * The lack of an activity assumes it is not allowed
 * @param sketch
 * @param activityAttrib
 */
export const getCategoryForActivities = (
  activities: string[]
): IucnCategoryCombined => {
  if (activities.length === 0) return iucnCategories["1a"];

  // Get first category where all activities allowed in sketch are allowed by the category
  let firstCategory: IucnCategoryCombined | undefined = undefined;
  const categoryIds = Object.keys(iucnCategories).sort();
  for (const categoryId of categoryIds) {
    const curCategory = iucnCategories[categoryId];
    const matchCategory = activities
      .map((act) => curCategory.allowedActivities.includes(act))
      .reduce((acc, hasActivity) => acc && hasActivity, true);
    if (matchCategory) {
      firstCategory = curCategory;
      break;
    }
  }
  if (!firstCategory) firstCategory = iucnCategories["None"];
  return firstCategory;
};
