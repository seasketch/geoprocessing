import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { GeoprocessingNestedStackProps, LambdaStack } from "./LambdaStack.js";

import {
  isGeoprocessingFunctionMetadata,
  isPreprocessingFunctionMetadata,
  isSyncFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest.js";
import { keyBy } from "../../client-core.js";

/**
 * Creates lambda sub-stacks, as many as needed so as not to break resource limit
 */
export const createLambdaStacks = (
  stack: GeoprocessingStack,
  props: GeoprocessingNestedStackProps,
): LambdaStack[] => {
  const FUNCTIONS_PER_STACK = props.functionsPerStack || 20;

  // create useful arrays and mappings of function metadata
  const syncFunctionMetas = stack.getSyncFunctionMetas();
  const asyncFunctionMetas = stack.getAsyncFunctionMetas();

  const asyncFunctionMap = keyBy(asyncFunctionMetas, (f) => f.title);
  const syncFunctionMap = keyBy(syncFunctionMetas, (f) => f.title);

  const asyncTitles = Object.keys(asyncFunctionMap);
  const syncTitles = Object.keys(syncFunctionMap);

  // Map of async function titles to their worker function titles
  const asyncWorkerMap: Record<string, string[]> = {};
  for (const func of props.manifest.geoprocessingFunctions) {
    if (func.executionMode === "async") {
      asyncWorkerMap[func.title] = [];
    }
  }

  for (const asyncFuncMeta of asyncFunctionMetas) {
    if (asyncFuncMeta.workers) {
      for (const worker of asyncFuncMeta.workers) {
        const workerMeta = syncFunctionMap[worker];
        if (workerMeta && isSyncFunctionMetadata(workerMeta)) {
          asyncWorkerMap[asyncFuncMeta.title].push(worker);
        } else {
          throw new Error(
            `worker function ${worker} registered by ${asyncFuncMeta.title} not found in manifest or not a sync geoprocessing function`,
          );
        }
      }
    }
  }

  // Map of worker function titles to their parent function title
  const workerAsyncMap: Record<string, string> = {};
  for (const func of props.manifest.geoprocessingFunctions) {
    if (func.workers) {
      for (const worker of func.workers) {
        if (workerAsyncMap[worker]) {
          throw new Error(
            `Worker function ${worker} is used by more than one parent function: ${workerAsyncMap[worker]} and ${func.title}`,
          );
        } else {
          workerAsyncMap[worker] = func.title;
        }
      }
    }
  }

  // Compile list of sync functions that are not used as workers
  const nonWorkerSyncTitles: string[] = [];
  for (const syncTitle of syncTitles) {
    if (!workerAsyncMap[syncTitle]) {
      nonWorkerSyncTitles.push(syncTitle);
    }
  }

  for (const syncTitle of syncTitles) {
    // If worker function is same title as parent + 'Worker' but not registered with it, then throw
    if (syncTitle.includes("Worker")) {
      const baseTitle = syncTitle.replace("Worker", "");
      if (
        asyncTitles.includes(baseTitle) &&
        asyncWorkerMap[baseTitle] &&
        asyncWorkerMap[baseTitle].includes(syncTitle) === false
      ) {
        throw new Error(
          `If function ${syncTitle} is a worker of ${baseTitle} then it will need to be registered in the ${baseTitle} GeoprocessingHandler using workers option. e.g. workers: ['${syncTitle}']`,
        );
      }
    }
  }

  // console.log(
  //   "asyncFunctionWorkerMap",
  //   JSON.stringify(asyncWorkerMap, null, 2),
  // );
  // console.log("workerAsyncMap", JSON.stringify(workerAsyncMap, null, 2));

  // top-level functions (no workers)
  const parentTitles = [...Object.keys(asyncWorkerMap), ...nonWorkerSyncTitles];

  // create map of parent function titles to whether they've been allocated (default false)
  const allocatedParentMap = parentTitles.reduce<Record<string, boolean>>(
    (acc, cur) => {
      return { ...acc, [cur]: false };
    },
    {},
  );

  let numUnallocated = parentTitles.length;
  const functionGroups: ProcessingFunctionMetadata[][] = [];

  // allocate functions to stack groups
  while (numUnallocated > 0) {
    const curGroup: ProcessingFunctionMetadata[] = [];

    for (const parentTitle of parentTitles) {
      // Skip scenarios - all allocated, current stack is full, function already allocated
      if (
        numUnallocated === 0 ||
        curGroup.length >= FUNCTIONS_PER_STACK ||
        allocatedParentMap[parentTitle] === true
      ) {
        continue;
      }

      if (asyncWorkerMap[parentTitle]) {
        // async - make sure enough room for parent + workers
        const numFunctions = 1 + asyncWorkerMap[parentTitle].length;
        if (curGroup.length + numFunctions <= FUNCTIONS_PER_STACK) {
          curGroup.push(asyncFunctionMap[parentTitle]);
          for (const workerTitle of asyncWorkerMap[parentTitle]) {
            curGroup.push(syncFunctionMap[workerTitle]);
          }
        }
      } else {
        // sync
        curGroup.push(syncFunctionMap[parentTitle]);
      }

      allocatedParentMap[parentTitle] = true;
      numUnallocated -= 1;
    }

    // This function group is full as its gonna get
    functionGroups.push(curGroup);
  }

  functionGroups.forEach((group, index) => {
    console.log(
      `Lambda stack ${index}:\n ${group.map((f) => f.title).join("\n ")}`,
    );
    console.log("");
  });

  const lambdaStacks = functionGroups.map((funcGroup, i) => {
    const newStack = new LambdaStack(stack, `functions-group-${i}`, {
      ...props,
      manifest: {
        // shave down manifest to just the functions in this group
        ...props.manifest,
        preprocessingFunctions: funcGroup.filter(
          isPreprocessingFunctionMetadata,
        ),
        geoprocessingFunctions: funcGroup.filter(
          isGeoprocessingFunctionMetadata,
        ),
      },
    });

    return newStack;
  });

  return lambdaStacks;
};
