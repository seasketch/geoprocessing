import { MpaClassification, Zone } from "./types";
import {
  RbcsMpaProtectionLevel,
  rbcsMpaProtectionLevels,
  rbcsScores,
  rbcsConstants,
  classifyMPA,
  RegBasedClassificationMetric,
} from "./rbcs";
import {
  Sketch,
  SketchCollection,
  NullSketch,
  NullSketchCollection,
  Metric,
} from "../types";
import {
  isSketchCollection,
  isNullSketchCollection,
  toNullSketchArray,
  getJsonUserAttribute,
  getUserAttribute,
  keyBy,
  getSketchFeatures,
} from "../helpers";
import { createMetric } from "../metrics";

/**
 * Type guard for checking string is one of supported objective IDs
 * Use in conditional block logic to coerce to type RbcsObjectiveKey within the block
 */
export function isRbcsProtectionLevel(
  key: string
): key is RbcsMpaProtectionLevel {
  return rbcsMpaProtectionLevels.includes(key as RbcsMpaProtectionLevel);
}

/**
 * Returns protection level given MPA classification index value
 */
export function getMpaClassificationName(index: number) {
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

export function getZoneClassificationName(zoneId: number) {
  return rbcsScores[zoneId].label;
}

export const sketchToZone = (
  sketch: Sketch | NullSketch,
  sketchArea: number
): Zone => {
  const gearTypes = getJsonUserAttribute<string[]>(
    sketch.properties,
    "GEAR_TYPES",
    []
  );
  const boating = getUserAttribute<string>(sketch.properties, "BOATING", "");
  const aquaculture = getUserAttribute<string>(
    sketch.properties,
    "AQUACULTURE",
    ""
  );
  const gearTypesMapped = gearTypes.map((gt) => rbcsConstants.GEAR_TYPES[gt]);
  const boatingMapped = rbcsConstants.BOATING_AND_ANCHORING[boating];
  const aquacultureMapped =
    rbcsConstants.AQUACULTURE_AND_BOTTOM_EXPLOITATION[aquaculture];
  return [gearTypesMapped, aquacultureMapped, boatingMapped, sketchArea];
};

/**
 * Returns object mapping sketch id to MPA classification
 * given sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes,
 * and area metrics for each sketch, assumes each mpa is a single zone mpa
 * @param sketch - sketch or sketch collection with GEAR_TYPES (multi),
 * BOATING (single), and AQUACULTURE (single) user attributes
 * @param childMetrics - area metrics for sketches
 */
export function getSketchToMpaProtectionLevel(
  sketch: Sketch | SketchCollection | NullSketchCollection | NullSketch,
  metrics: Metric[]
): Record<string, RbcsMpaProtectionLevel> {
  // Extract sketch features
  const sketchFeatures = getSketchFeatures(sketch);
  const sketchFeatureIds = sketchFeatures.map((sk) => sk.properties.id);
  const sketchFeatureAreaMetrics = metrics.filter((m) =>
    sketchFeatureIds.includes(m.sketchId!)
  );
  const areaBySketchFeature = keyBy(
    sketchFeatureAreaMetrics,
    (m) => m.sketchId!
  );

  // classify sketch features as single zone rbcs mpas
  const mpaClasses = sketchFeatures.map((sk) => {
    return classifyMPA([
      sketchToZone(sk, areaBySketchFeature[sk.properties.id].value),
    ]);
  });
  const mapping = mpaClasses.reduce<Record<string, RbcsMpaProtectionLevel>>(
    (mapSoFar, mpaClass, index) => ({
      ...mapSoFar,
      [sketchFeatures[index].properties.id]:
        mpaClass.indexLabel as RbcsMpaProtectionLevel,
    }),
    {}
  );

  return mapping;
}

/**
 * Transforms an rbcs zone object to a metric
 * @param sketch - single sketch zone
 * @param zone - rbcs zone
 * @param score
 * @returns
 */
export const rbcsZoneToMetric = (
  sketchId: string,
  zone: Zone,
  score: number
): RegBasedClassificationMetric => {
  return {
    ...createMetric({ value: score }),
    metricId: "rbcs",
    classId: "zone",
    sketchId,
    value: score,
    extra: {
      gearTypes: zone[0],
      aquaculture: zone[1],
      boating: zone[2],
    },
  };
};

export const rbcsMpaToMetric = (
  sketchId: string,
  score: number,
  label: string
): RegBasedClassificationMetric => {
  return {
    ...createMetric({ value: score }),
    metricId: "rbcs",
    classId: "mpa",
    sketchId,
    extra: {
      label,
    },
  };
};

/**
 * Given sketch for rbcsZone or collection of zone sketches with userAttributes for rcbs activities,
 * returns metrics with zone classification score as value.
 * If sketch collection, collection metric will have mpa classification score index as value
 * @param sketch - sketch or sketch collection with GEAR_TYPES (multi),
 * BOATING (single), and AQUACULTURE (single) user attributes
 * @param childMetrics - area metrics for sketches
 */
export function zoneClassMetrics(
  sketch: NullSketchCollection | NullSketch,
  childAreaMetrics?: Metric[]
): RegBasedClassificationMetric[] {
  const areaBySketch = keyBy(childAreaMetrics || [], (m) => m.sketchId!);
  const sketches = toNullSketchArray(sketch);

  // Extract user attributes from sketch and classify zones
  const sketchZones: Zone[] = sketches.map((sk) =>
    sketchToZone(sk, areaBySketch[sk.properties.id].value)
  );
  const collectionResult: MpaClassification = classifyMPA(sketchZones);

  // Transform zone metrics
  const metrics: RegBasedClassificationMetric[] = collectionResult.scores.map(
    (score, index) =>
      rbcsZoneToMetric(sketches[index].properties.id, sketchZones[index], score)
  );
  if (isSketchCollection(sketch) || isNullSketchCollection(sketch)) {
    metrics.push(
      rbcsMpaToMetric(
        sketch.properties.id,
        collectionResult.index,
        collectionResult.indexLabel
      )
    );
  }
  return metrics;
}

/**
 * Given sketch for rbcsMpa with rbcs activity userAttributes,
 * assumes mpa is a single zone mpa and returns metrics with mpa classification score
 * @param sketch - sketch with GEAR_TYPES (multi),
 * BOATING (single), and AQUACULTURE (single) user attributes
 * @param childAreaMetric - area metric for sketch
 */
export function mpaClassMetric(
  sketch: NullSketch,
  childAreaMetric: Metric
): RegBasedClassificationMetric[] {
  const zoneClass = sketchToZone(sketch, childAreaMetric.value);
  const mpaClass = classifyMPA([zoneClass]);
  return [
    // Convert all zone scores but will only be 1
    ...mpaClass.scores.map((zoneScore) =>
      rbcsZoneToMetric(sketch.properties.id, zoneClass, zoneScore)
    ),
    rbcsMpaToMetric(sketch.properties.id, mpaClass.index, mpaClass.indexLabel),
  ];
}

/**
 * Given sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes,
 * assumes each mpa is a single zone mpa and returns metrics with mpa classification score
 * Collection metric will have mpa classification score index as value
 * @param sketch - sketch or sketch collection with GEAR_TYPES (multi),
 * BOATING (single), and AQUACULTURE (single) user attributes
 * @param childMetrics - area metrics for sketches
 */
export function mpaClassMetrics(
  sketch: NullSketchCollection | NullSketch,
  childAreaMetrics?: Metric[]
): RegBasedClassificationMetric[] {
  const areaBySketch = keyBy(childAreaMetrics || [], (m) => m.sketchId!);
  const sketches = toNullSketchArray(sketch);

  // classify sketches as single zone rcbs mpas
  const metrics: RegBasedClassificationMetric[] = sketches.map((sk) => {
    const mpaClass = classifyMPA([
      sketchToZone(sk, areaBySketch[sk.properties.id].value),
    ]);
    return rbcsMpaToMetric(
      sk.properties.id,
      mpaClass.index,
      mpaClass.indexLabel
    );
  });

  return metrics;
}

/**
 * Returns percent protection given index value,
 * percent is proportion (percent) of bottom color to top color to use for icon given index value (as shown in paper)
 * e.g. index = 5.4 means bottom icon color should take 25% of icon and top color 75%
 * @param index - classification index value for sketch collection
 */
export function getIndexIconPerc(index: number) {
  if (index < 3) {
    return 100;
  } else if (index < 5) {
    return 75;
  } else if (index < 6) {
    return 50;
  } else if (index < 7) {
    return 25;
  } else {
    return 0;
  }
}
