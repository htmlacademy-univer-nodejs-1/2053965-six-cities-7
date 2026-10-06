import type {Command} from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';

export class CliApplication {
  private commands: Record<string, Command> = {};
  private readonly defaultCommand = '--help';

  public registerCommands(commands: Command[]): void {
    commands.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Команда ${command.getName()} уже зарегистрирована`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(
        `Команда по умолчанию (${this.defaultCommand}) не зарегистрирована.`
      );
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(cliArguments: string[]): void {
    const parsedCommand = CommandParser.parse(cliArguments);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
