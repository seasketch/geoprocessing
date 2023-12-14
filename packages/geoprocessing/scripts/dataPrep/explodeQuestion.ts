import inquirer from "inquirer";

export interface ExplodeAnswers {
  explodeMulti: boolean;
}

export async function explodeQuestion(
  questionText?: string
): Promise<Pick<ExplodeAnswers, "explodeMulti">> {
  return inquirer.prompt<Pick<ExplodeAnswers, "explodeMulti">>([
    {
      type: "list",
      name: "explodeMulti",
      message: questionText
        ? questionText
        : "Should multi-part geometries be split into multiple single-part geometries? (can increase sketch overlap calc performance by reducing number of polygons to fetch)",
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
