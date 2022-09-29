import inquirer from "inquirer";

export interface PublishAnswers {
  publish: "yes" | "no";
}

export async function publishQuestion(
  questionText?: string
): Promise<Pick<PublishAnswers, "publish">> {
  return inquirer.prompt<Pick<PublishAnswers, "publish">>([
    {
      type: "list",
      name: "publish",
      message: questionText
        ? questionText
        : "Do you want to publish the datasource to S3 cloud storage now or wait?",
      default: "no",
      choices: [
        {
          value: "yes",
          name: "Yes",
        },
        {
          value: "no",
          name: "No",
        },
      ],
    },
  ]);
}
