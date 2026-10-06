import chalk from 'chalk';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command } from './command.interface.js';
import { PackageVersionReader } from '../../shared/libs/index.js';

export class VersionCommand implements Command {
  private readonly packageVersionReader: PackageVersionReader;

  constructor() {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const packageJsonPath = resolve(currentDirectory, '../../../package.json');
    this.packageVersionReader = new PackageVersionReader(packageJsonPath);
  }

  public getName(): string {
    return '--version';
  }

  public execute(): void {
    try {
      const version = this.packageVersionReader.read();
      console.info(chalk.magenta(`v${version}`));
    } catch (error: unknown) {
      console.error(chalk.red('Не удалось определить версию приложения.'));
      if (error instanceof Error) {
        console.error(chalk.red(`Ошибка: ${error.message}`));
      }
    }
  }
}
