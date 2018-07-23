const inquirer = require("inquirer");
const generateTemplateTypes = require("../helpers/generateTemplateTypes");

class TemplatePrompt {
  constructor(templatesDir, logger) {
    this.templatesDir = templatesDir;
    this.logger = logger;
    this.templates = generateTemplateTypes(templatesDir);
  }

  async prompt() {
    const { template } = await inquirer.prompt([
      {
        name: "template",
        type: "rawlist",
        message: "Choose your template.",
        choices: Object.keys(this.templates)
      }
    ]);

    const { version } = await inquirer.prompt([
      {
        name: "version",
        type: "rawlist",
        message: `Choose the version of the ${template} template.`,
        choices: this.templates[template].versions
      }
    ]);

    return {
      template,
      version
    };
  }
}

module.exports = TemplatePrompt;
