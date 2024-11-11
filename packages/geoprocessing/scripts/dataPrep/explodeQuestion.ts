import inquirer from "inquirer";

export interface ExplodeAnswers {
  explodeMulti: boolean;
}

export async function explodeQuestion(
  questionText?: string,
): Promise<Pick<ExplodeAnswers, "explodeMulti">> {
  return inquirer.prompt<Pick<ExplodeAnswers, "explodeMulti">>([
    {
      type: "list",
      name: "explodeMulti",
      message:
        questionText ||
        "Should multi-part geometries be split into single-part geometries?",
      default: "yes",
      choices: [
        {
          value: true,
          name: "Yes",
        },
        {
          value: false,
          name: "No",
        },
      ],
    },
  ]);
}
