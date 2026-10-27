#!/usr/bin/env node

import {
  CliApplication,
  GenerateCommand,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';

const application = new CliApplication();
application.registerCommands([
  new HelpCommand(),
  new GenerateCommand(),
  new ImportCommand(),
  new VersionCommand(),
]);

application.processCommand(process.argv.slice(2));
