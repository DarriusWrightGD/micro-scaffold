const inquirer = require('inquirer');

class ConfirmPrompt {
  constructor(confirmMessage) {
    this.confirmMessage = confirmMessage || "Look good?";
  }
  async prompt() {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        message: this.confirmMessage,
        name: "confirm"
      }
    ]);

    return confirm;
  }
}

module.exports = ConfirmPrompt;