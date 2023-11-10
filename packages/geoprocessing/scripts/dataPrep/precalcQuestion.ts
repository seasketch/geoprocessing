import inquirer from "inquirer";

export interface PrecalcAnswers {
  precalc: boolean;
}

export async function precalcQuestion(
  questionText?: string
): Promise<Pick<PrecalcAnswers, "precalc">> {
  return inquirer.prompt<Pick<PrecalcAnswers, "precalc">>([
    {
      type: "list",
      name: "precalc",
      message: questionText
        ? questionText
        : "Do you want to precalculate summary metrics for this datasource? (Typically yes only if reporting sketch % overlap with datasource)",
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
