import { DynamoDBDocument, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { wait } from "../../helpers/wait.js";

/**
 * Run dynamodb update commands synchronously to avoid throttling, retrying on ThroughputError
 */
export async function updateCommandsSync(
  db: DynamoDBDocument,
  commands: UpdateCommand[],
) {
  for (let i = 0; i <= commands.length - 1; i++) {
    const curCommand = commands[i];
    try {
      await db.send(curCommand);
    } catch (error: any) {
      if (
        error.$metadata &&
        error.$metadata.httpStatusCode === 400 &&
        error.$metadata.totalRetryDelay
      ) {
        console.log(
          `ThroughputError saving item, retrying in ${error.$metadata.totalRetryDelay}ms`,
        );
        await wait(error.$metadata.totalRetryDelay);
        await updateCommandsSync(db, [curCommand]);
      } else {
        throw new Error(error);
      }
    }
  }
}
