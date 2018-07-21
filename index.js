#!/usr/bin/env node

const prog = require('caporal');
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf-8'));
const generateCommand = require('./commands/generate');


prog
  .version(packageJson['version'])
  .command('generate', 'Generate a new application from the available templates.')
  .action(generateCommand);

prog.parse(process.argv);
