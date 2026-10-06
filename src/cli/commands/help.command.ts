import chalk from 'chalk';
import type { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(): void {
    console.info(`
      ${chalk.bold.green('Программа для подготовки данных для REST API сервера.')}
      ${chalk.gray('Пример:')} ${chalk.cyan('cli.js --<command> [--arguments]')}
      ${chalk.bold('Команды:')}

      ${chalk.cyan('--help')}                       ${chalk.gray('# печатает этот текст')}
      ${chalk.cyan('--version')}                    ${chalk.gray('# выводит номер версии')}
      ${chalk.cyan('--import <path>')}              ${chalk.gray('# импортирует данные из TSV')}
    `);
  }
}
