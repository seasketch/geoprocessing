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
    } catch (e: any) {
      if (
        e.$metadata &&
        e.$metadata.httpStatusCode === 400 &&
        e.$metadata.totalRetryDelay
      ) {
        console.log(
          `ThroughputError saving item, retrying in ${e.$metadata.totalRetryDelay}ms`,
        );
        await wait(e.$metadata.totalRetryDelay);
        await updateCommandsSync(db, [curCommand]);
      } else {
        throw new Error(e);
      }
    }
  }
}
