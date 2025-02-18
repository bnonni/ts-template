#!/usr/bin/env node
import { program } from 'commander';
import TsTemplate from './ts-template.js';

// cli: init-ts-template
program
  .version('init-ts-template 0.2.2', '-v, --version', 'Output the current version.')
  .description('TypeScript project template initializer with support for tsconfig.')
  .option('-n, --name <name>', 'Package name.')
  .action(async (options: any) => await TsTemplate.init(options))
  .parse();