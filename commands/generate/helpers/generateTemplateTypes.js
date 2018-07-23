const fs = require('fs');

module.exports = templatesFolder => {
  const templateTypes = {};
  const templates = fs.readdirSync(templatesFolder);
  
  templates.forEach(templateDir => {

    const templateVersions = fs.readdirSync(
      `${templatesFolder}/${templateDir}`
    ).reverse();
    
    templateTypes[templateDir] = {
      versions: templateVersions,
      default: templateVersions[0]
    };
  });

  return templateTypes;
};