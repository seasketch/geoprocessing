import {
  MpaClassification,
  Zone,
  ZoneColor,
  ZoneId,
  ZoneName,
} from "./types.js";

export const rbcsConstants: Record<string, Record<string, string>> = {
  GEAR_TYPES: {
    BEACH_SEINES: "Beach seines",
    CAST_NETS: "Cast nets",
    DREDGES: "Dredges (bivalves)",
    DRIFT_NETS: "Drift nets",
    FISH_TRAPS: "Fish traps",
    FIXED_FISH_TRAPS: "Fixed fish traps “madrague”",
    GILLNETS: "Gillnets",
    HAND_DREDGES: "Hand dredges (bivalves)",
    HAND_HARVESTING: "Hand harvesting",
    INTERTIDAL_HAND_CAPTURES: "Intertidal hand captures",
    LINES: "Lines (jigs, hook and line, rod, troll)",
    LONGLINES_BOTTOM: "Longlines (bottom)",
    LONGLINES_PELAGIC: "Longlines (pelagic)",
    PURSE_SEINING_BOTTOM: "Purse seining (bottom)",
    PURSE_SEINING_PELAGIC: "Purse seining (pelagic)",
    SPEARFISHING: "Spearfishing/diving",
    SURROUNDING_NETS: "Surrounding nets near shore",
    TRAMMEL_NETS: "Trammel nets",
    TRAPS: "Traps (lobster/octopus/crab)",
    TRAWL_BOTTOM: "Trawl (bottom)",
    TRAWL_PELAGIC: "Trawl (pelagic)",
  },
  AQUACULTURE_AND_BOTTOM_EXPLOITATION: {
    NOT_ALLOWED: "Aquaculture and bottom exploitation not allowed",
    SOME_RESTRICTIONS:
      "Aquaculture OR bottom exploitation allowed, but not mining/oil platforms/sand extraction/detonations",
    NO_RESTRICTIONS:
      "Both aquaculture AND bottom exploitation allowed with no restrictions (or if aquaculture is not allowed but mining/oil platforms/sand ex-traction/detonations are)",
  },
  BOATING_AND_ANCHORING: {
    NOT_ALLOWED: "No anchoring",
    FULLY_REGULATED:
      "Boating and/or anchoring allowed but anchoring is fully regulated: restricted to particular areas or mooring buoys",
    UNREGULATED:
      "Boating and/or anchoring allowed but anchoring is only partially 2 regulated or unregulated",
  },
};

//// SCORES ////

export const rbcsGearTypes: Record<string, number> = {
  "Beach seines": 8,
  "Cast nets": 3,
  "Dredges (bivalves)": 7,
  "Drift nets": 5,
  "Fish traps": 6,
  "Fixed fish traps “madrague”": 6,
  Gillnets: 6,
  "Hand dredges (bivalves)": 5,
  "Hand harvesting": 4,
  "Intertidal hand captures": 3,
  "Lines (jigs, hook and line, rod, troll)": 5,
  "Longlines (bottom)": 5,
  "Longlines (pelagic)": 4,
  "Purse seining (bottom)": 9,
  "Purse seining (pelagic)": 5,
  "Spearfishing/diving": 3,
  "Surrounding nets near shore": 8,
  "Trammel nets": 8,
  "Traps (lobster/octopus/crab)": 4,
  "Trawl (bottom)": 9,
  "Trawl (pelagic)": 5,
};

export const rbcsAquacultureActivities: Record<string, number> = {
  "Aquaculture and bottom exploitation not allowed": 0,
  "Aquaculture OR bottom exploitation allowed, but not mining/oil platforms/sand extraction/detonations": 1,
  "Both aquaculture AND bottom exploitation allowed with no restrictions (or if aquaculture is not allowed but mining/oil platforms/sand ex-traction/detonations are)": 2,
};

export const rbcsAnchoringActivities: Record<string, number> = {
  "No anchoring": 0,
  "Boating and/or anchoring allowed but anchoring is fully regulated: restricted to particular areas or mooring buoys": 1,
  "Boating and/or anchoring allowed but anchoring is only partially 2 regulated or unregulated": 2,
};

export const gearTypeScore = (regulation: string) =>
  getScore(regulation, rbcsGearTypes, "Gear Type");
export const aquacultureScore = (regulation: string) =>
  getScore(regulation, rbcsAquacultureActivities, "Aquaculture Activity Type");
export const anchorScore = (regulation: string) =>
  getScore(regulation, rbcsAnchoringActivities, "Anchoring Activity Type");

function getScore(
  key: string,
  lookup: Record<string, number>,
  errorType: string,
) {
  if (key in lookup) {
    return lookup[key];
  } else {
    throw new Error(`Could not find ${errorType} ${key}.
      Must be one of the following: ${Object.keys(lookup).join(", ")}`);
  }
}

//// MAIN ////

/** Given activity scores, returns zone number */
export function classifyZone(
  gearTypes: string[],
  aquaculture: string,
  anchoring: string,
): number {
  const aquacultureAndBottomExploitationScore = aquacultureScore(aquaculture);
  const anchoringScore = anchorScore(anchoring);
  const maxGearScore = Math.max(
    ...gearTypes.map((type) => gearTypeScore(type)),
  );
  // >20
  if (gearTypes.length > 20) {
    return 8;
    // 16-20
  } else if (gearTypes.length >= 16) {
    return 7;
    // 11-15
  } else if (gearTypes.length >= 11) {
    return 6;
    // 6-10
  } else if (gearTypes.length >= 6) {
    if (maxGearScore === 9) {
      return 6;
      // <= 8
    } else {
      if (aquacultureAndBottomExploitationScore === 2) {
        return 6;
      } else {
        return 5;
      }
    }
    // 1-5
  } else if (gearTypes.length >= 1) {
    // 9
    if (maxGearScore === 9) {
      return 6;
      // 6-8
    } else if (maxGearScore >= 6) {
      if (aquacultureAndBottomExploitationScore === 2) {
        return 6;
      } else {
        return 5;
      }
      // <= 5
    } else {
      if (aquacultureAndBottomExploitationScore === 2) {
        return 6;
      } else {
        return 4;
      }
    }
    // 0
  } else {
    // no gear allowed
    if (aquacultureAndBottomExploitationScore === 2) {
      return 6;
    } else if (aquacultureAndBottomExploitationScore === 1) {
      return 4;
    } else {
      if (anchoringScore === 2) {
        return 3;
      } else if (anchoringScore === 1) {
        return 2;
      } else {
        return 1;
      }
    }
  }
}

/** Given zone scores, returns object containing final scores, and mpa classification */
export function classifyMPA(zones: Zone[]): MpaClassification {
  const zoneScores: number[][] = [];
  for (const zone of zones) {
    if (zone.length < 4) {
      throw new Error(
        "Expected array of 4 arguments for each zone (gearTypes, aquacultureAndBottomExploitation, boating, and area",
      );
    } else {
      zoneScores.push([classifyZone(zone[0], zone[1], zone[2]), zone[3]]);
    }
  }
  const sumArea = zoneScores.reduce((sum, score) => sum + score[1], 0);
  const score = zoneScores.reduce(
    (sum, score) => sum + (score[0] * score[1]) / sumArea,
    0,
  );
  return {
    scores: zoneScores.map((zoneScore) => zoneScore[0]),
    index: score,
    indexLabel: getClassificationLabel(score),
  };
}

export const rbcsScores: Record<ZoneId, { label: ZoneName; color: ZoneColor }> =
  {
    1: {
      label: "No-take/No-go",
      color: "rgb(78, 142, 135)",
    },
    2: {
      label: "No-take/Regulated access",
      color: "rgb(147,181,54)",
    },
    3: {
      label: "No-take/Unregulated access",
      color: "rgb(235,204,53)",
    },
    4: {
      label: "Highly regulated extraction",
      color: "rgb(203,131,44)",
    },
    5: {
      label: "Moderately regulated extraction",
      color: "rgb(176,33,97)",
    },
    6: {
      label: "Weakly regulated extraction",
      color: "rgb(115,25,74)",
    },
    7: {
      label: "Very weakly regulated extraction",
      color: "rgb(68,25,105)",
    },
    8: {
      label: "Unregulated extraction",
      color: "rgb(72,46,19)",
    },
  };

export function getClassificationLabel(index) {
  if (index < 3) {
    return "Fully Protected Area";
  } else if (index < 5) {
    return "Highly Protected Area";
  } else if (index < 6) {
    return "Moderately Protected Area";
  } else if (index < 7) {
    return "Poorly Protected Area";
  } else {
    return "Unprotected Area";
  }
}
