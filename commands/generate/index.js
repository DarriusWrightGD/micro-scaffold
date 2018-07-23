const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const { formatOutputDirectory } = require("./helpers");

const {TemplatePrompt, ConfirmPrompt, ProjectPrompt} = require('./prompts');

const localPath = process.cwd();

const templateDir = `${__dirname}/../../templates`;
// const templates = generateTemplateTypes(templateDir);




module.exports = async (args, options, logger) => {

  let projectAnswers = {};
  let templateVariables = {};
  let templateChoice = "";
  let templatePath = "";
  do {
    const templatePrompt = new TemplatePrompt(templateDir,logger);
    const {template, version } = await templatePrompt.prompt();

    templateChoice = template;
    templatePath = `${__dirname}/../../templates/${template}/${version}`;
    
    const projectPrompt = new ProjectPrompt(templatePath);
    ({templateVariables, projectAnswers} = await projectPrompt.prompt());
    logger.info(`Answers: ${JSON.stringify(projectAnswers, null, 2)}`);
  }while(!await new ConfirmPrompt().prompt())

  // Create the project
  const outputDirectory = formatOutputDirectory(projectAnswers.name);

  if (outputDirectory && !fs.existsSync(`${localPath}${outputDirectory}`)) {
    logger.info(`Creating the output directory [${outputDirectory}]`);
    shell.mkdir(`${localPath}${outputDirectory}`);
  }

  if (fs.existsSync(templatePath)) {
    logger.info(`Copying files for the template [${templateChoice}]`);
    shell.cp("-R", `${templatePath}/*`, `${localPath}${outputDirectory}`);
    logger.info("The files have been copied");
  } else {
    logger.error(`The requested template [${templateChoice}] was not found`);
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
  const cdCommand = outputDirectory ? `cd ${projectAnswers.name}\n` : "";
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
