import inquirer from "inquirer";

export interface PublishAnswers {
  publish: "yes" | "no";
}

export async function publishQuestion(): Promise<
  Pick<PublishAnswers, "publish">
> {
  return inquirer.prompt<Pick<PublishAnswers, "publish">>([
    {
      type: "list",
      name: "publish",
      message: "Do you want to publish to S3 cloud storage now?",
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
