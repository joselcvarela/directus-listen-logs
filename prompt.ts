import inquirer from "inquirer";

const PARAMS = {
  mask: false,
};

export async function inputString(
  message: string = "What is the string?",
  params = PARAMS
) {
  const string: string = await inquirer
    .prompt([
      { type: params?.mask ? "password" : "input", message, name: "value" },
    ])
    .then((r) => r.value);

  return string;
}
