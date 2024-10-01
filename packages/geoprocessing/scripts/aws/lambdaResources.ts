import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { GeoprocessingNestedStackProps, LambdaStack } from "./LambdaStack.js";

import {
  GeoprocessingFunctionMetadata,
  isGeoprocessingFunctionMetadata,
  isPreprocessingFunctionMetadata,
  isSyncFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest.js";
import { keyBy } from "../../client-core.js";
import { CfnOutput } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";

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

  // console.log("functionMetas", JSON.stringify(functionMetas, null, 2));
  // console.log("workerMetas", JSON.stringify(workerMetas, null, 2));

  // Allocate functions to stack groups

  const functionTitles = [
    ...Object.keys(asyncWorkerMap),
    ...nonWorkerSyncTitles,
  ];
  const functionMetas = functionTitles.map(
    (title) => asyncFunctionMap[title] || syncFunctionMap[title],
  );
  const functionMap = keyBy(functionMetas, (f) => f.title);

  const propFunctionGroups: GeoprocessingFunctionMetadata[][] =
    props.existingFunctionStacks
      ? props.existingFunctionStacks.map((g) =>
          g
            .filter((title) => functionTitles.includes(title)) // filter out any titles that are not in manifest this time
            .map((title) => asyncFunctionMap[title] || syncFunctionMap[title]),
        )
      : [];

  const functionGroups = allocateFunctionsToGroups(
    functionMap,
    propFunctionGroups,
    FUNCTIONS_PER_STACK,
  );

  for (const [index, group] of functionGroups.entries()) {
    console.log(
      `Lambda stack ${index}:\n ${group.map((f) => f.title).join("\n ")}`,
    );
    console.log("");
  }

  new CfnOutput(stack, "stacksFunction", {
    value: JSON.stringify(functionGroups.map((g) => g.map((f) => f.title))),
  });

  const functionStacks = functionGroups.map((funcGroup, i) => {
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

  // Allocate workers to stack groups

  const workerTitles = Object.keys(workerAsyncMap);
  const workerMetas = workerTitles.map((title) => syncFunctionMap[title]);
  const workerMap = keyBy(workerMetas, (f) => f.title);

  const propWorkerGroups: ProcessingFunctionMetadata[][] =
    props.existingWorkerStacks
      ? props.existingWorkerStacks.map(
          (g) =>
            g
              .filter((title) => workerTitles.includes(title))
              .map((title) => workerMap[title]), // filter out any titles that are not in manifest this time
        )
      : [];

  const workerGroups = allocateFunctionsToGroups(
    workerMap,
    propWorkerGroups,
    FUNCTIONS_PER_STACK,
  );

  for (const [index, group] of workerGroups.entries()) {
    console.log(
      `Worker stack ${index}:\n ${group.map((f) => f.title).join("\n ")}`,
    );
    console.log("");
  }

  new CfnOutput(stack, "stacksWorker", {
    value: JSON.stringify(workerGroups.map((g) => g.map((f) => f.title))),
  });

  const workerStacks = workerGroups.map((workerGroup, i) => {
    const newStack = new LambdaStack(stack, `workers-group-${i}`, {
      ...props,
      manifest: {
        // shave down manifest to just the functions in this group
        ...props.manifest,
        preprocessingFunctions: workerGroup.filter(
          isPreprocessingFunctionMetadata,
        ),
        geoprocessingFunctions: workerGroup.filter(
          isGeoprocessingFunctionMetadata,
        ),
      },
    });

    return newStack;
  });

  // get all run lambdas and create policies for them to invoke workers
  const runLambdas: Function[] = functionStacks.reduce<Function[]>(
    (acc, curStack) => {
      return [...acc, ...curStack.getAsyncRunLambdas()];
    },
    [],
  );
  for (const stack of workerStacks) {
    stack.createLambdaSyncPolicies(runLambdas);
  }

  return [...functionStacks, ...workerStacks];
};

function allocateFunctionsToGroups(
  functionMap: Record<string, ProcessingFunctionMetadata>,
  existingGroups: ProcessingFunctionMetadata[][],
  functionsPerStack: number,
) {
  const functionTitles = Object.keys(functionMap);
  let numUnallocatedFunctions = functionTitles.length;
  const functionGroups: ProcessingFunctionMetadata[][] = [];
  let curGroupIndex = 0;

  const allocatedFunctionMap = functionTitles.reduce<Record<string, boolean>>(
    (acc, cur) => {
      return { ...acc, [cur]: false };
    },
    {},
  );

  const allExistingFunctionTitles = existingGroups.reduce<string[]>(
    (acc, cur) => [...acc, ...cur.map((f) => f.title)],
    [],
  );

  let curLoop = 0;
  const maxLoops = 500;

  while (numUnallocatedFunctions > 0) {
    const curGroup: ProcessingFunctionMetadata[] = [];

    // Start with existing function group if available
    if (existingGroups.length > 0 && curGroupIndex < existingGroups.length) {
      const existingFunctions = existingGroups[curGroupIndex];

      if (existingFunctions) {
        curGroup.push(...existingFunctions);
        numUnallocatedFunctions -= existingFunctions.length;
        for (const f of existingFunctions) allocatedFunctionMap[f.title] = true;
      }
    }

    // Fill up the rest of the function group
    for (const functionTitle of functionTitles) {
      if (
        numUnallocatedFunctions === 0 || // all allocated
        curGroup.length >= functionsPerStack || // current stack is full
        allocatedFunctionMap[functionTitle] === true || // function already allocated
        allExistingFunctionTitles.includes(functionTitle) // function already exists in another stack
      ) {
        continue;
      }

      curGroup.push(functionMap[functionTitle]);

      allocatedFunctionMap[functionTitle] = true;
      numUnallocatedFunctions -= 1;
      curLoop += 1;
      if (curLoop > maxLoops) {
        throw new Error(
          `Too many loops while allocating functions to groups, something is wrong`,
        );
      }
    }

    // This function group is full as its gonna get, move on to the next
    functionGroups.push(curGroup);
    curGroupIndex += 1;
  }

  return functionGroups;
}
