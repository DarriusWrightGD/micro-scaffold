const shell = require("shelljs");
const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");

const localPath = process.cwd();
const templateTypes = {
  sam: {
    default: "0.5.0",
    availableVersions: ["0.5.0", "0.4.0"]
  }
};

const formatOutputDirectory = input => {
  if (input) {
    if (!input.startsWith("/")) {
      input = "/" + input;
    }
    if (input.endsWith("/")) {
      input = input.substring(0, input.length - 1);
    }
  }

  return input;
};

module.exports = async (args, options, logger) => {
  let promptComplete = false;
  let projectAnswers = {};
  let templateVariables = {};
  let template = "";
  let templatePath = "";

  while (!promptComplete) {
    // Choose your template
    ({ template } = await inquirer.prompt([
      {
        name: "template",
        type: "rawlist",
        message: "Choose your template.",
        choices: Object.keys(templateTypes)
      }
    ]));

    const templateType = templateTypes[template];

    const { version } = await inquirer.prompt([
      {
        name: "version",
        type: "rawlist",
        message: `Choose the version of the ${template} template.`,
        choices: templateType.availableVersions
      }
    ]);

    templatePath = `${__dirname}/../templates/${template}/${version}`;

    // Answer template questions
    templateVariables = require(`${templatePath}/_variables`);
    projectAnswers = await inquirer.prompt(templateVariables);
    logger.info("Answers: ", JSON.stringify(projectAnswers, null, 2));

    ({ promptComplete } = await inquirer.prompt([
      {
        type: "confirm",
        message: "Look good?",
        name: "promptComplete"
      }
    ]));
  }
  // Create the project
  const outputDirectory = formatOutputDirectory(projectAnswers.name);

  if (outputDirectory && !fs.existsSync(`${localPath}${outputDirectory}`)) {
    logger.info(`Creating the output directory [${outputDirectory}]`);
    shell.mkdir(`${localPath}${outputDirectory}`);
  }

  if (fs.existsSync(templatePath)) {
    logger.info(`Copying files for the template [${template}]`);
    shell.cp("-R", `${templatePath}/*`, `${localPath}${outputDirectory}`);
    logger.info("The files have been copied");
  } else {
    logger.error(`The requested template [${template}] was not found`);
    process.exit();
  }

  //assign the name if one has not been set
  projectAnswers.name = projectAnswers.name || path.basename(localPath);

  shell.ls("-Rl", `.${outputDirectory}`).forEach(entry => {
    if (entry.isFile()) {
      // Replace '[VARIABLE]` with the corresponding variable value from the prompt
      templateVariables.forEach(variable => {
        shell.sed(
          "-i",
          `\\[${variable.name.toUpperCase()}\\]`,
          projectAnswers[variable.name],
          outputDirectory ? `.${outputDirectory}/${entry.name}` : entry.name
        );
      });
    }
  });

  logger.info(" Success!");
  const cdCommand = outputDirectory ? `cd .${outputDirectory}\n` : "";
  logger.info(
    `Run the following commands to get started:\n
    ${cdCommand}
    npm install\n
    npm start\n`
  );

  if (fs.existsSync(`${localPath}${outputDirectory}/_variables.js`)) {
    shell.rm(`${localPath}${outputDirectory}/_variables.js`);
  }
};
