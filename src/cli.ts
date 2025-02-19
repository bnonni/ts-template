#!/usr/bin/env node
import { program } from 'commander';
import TsTemplate from './ts-template.js';
const pkg = require('../../package.json');
// cli: init-ts-template
program
  .version(`init-ts-template ${pkg.version}`, '-v, --version', 'Output the current version.')
  .description('TypeScript project template initializer with support for tsconfig.')
  .option('-n, --name <name>', 'Package name.')
  .option('-d, --description <description>', 'Package description.')
  .action(async (options: any) => await TsTemplate.init(options))
  .parse();