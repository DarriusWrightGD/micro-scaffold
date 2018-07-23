const inquirer = require('inquirer');

class ProjectPrompt {
  constructor(templatePath) {
    this.templatePath = templatePath
  }

  async prompt() {
    const templateVariables = require(`${this.templatePath}/_variables`);
    const projectAnswers = await inquirer.prompt(templateVariables);

    return {
      templateVariables,
      projectAnswers
    }
  }
}

module.exports = ProjectPrompt;