#!/usr/bin/env node

import {
  CliApplication,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';

const application = new CliApplication();
application.registerCommands([
  new HelpCommand(),
  new ImportCommand(),
  new VersionCommand(),
]);

application.processCommand(process.argv.slice(2));
