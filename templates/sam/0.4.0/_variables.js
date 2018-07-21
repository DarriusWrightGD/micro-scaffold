const path = require('path');

const validate = (regex, errorMessage) => {
  return function (value) {
    if(value.match(regex)) { return true }
    return errorMessage
  }
}

module.exports = [
  {
    name: "name",
    validate: validate(/^[a-z\-]*$/, "Name can only consist of lowercase letters and dashes."),
    message: `Enter the name of your project, leave blank to use the current directory: (${path.basename(process.cwd())})`,
  },
  {
    name: "version",
    validate: validate( /^\d+\.\d+\.\d+$/, "Version must be in the following format {d+}.{d+}.{d+}"),
    message: "Enter the project version:",
    default: "0.0.1"
  },
  {
    name: "description",
    message: "Enter the description of the application:",
  },
  {
    name: "author",
    message: "Enter the author of the service:",
  }
];
