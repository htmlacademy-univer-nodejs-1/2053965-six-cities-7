import chalk from 'chalk';
import type {Command} from './command.interface.js';
import {HttpClient} from '../../shared/libs/http-client.js';
import {OfferGenerator} from '../../shared/libs/offer-generator.js';
import {TsvFileWriter} from '../../shared/libs/file-writer/tsv-file-writer.js';

export class GenerateCommand implements Command {
  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [countValue, filename, url] = parameters;
    const count = Number(countValue);

    if (!Number.isInteger(count) || count <= 0 || !filename || !url) {
      console.error(
        chalk.red('Использование: --generate <n> <filepath> <url>')
      );
      return;
    }

    try {
      const data = await new HttpClient().get(url);
      const generator = new OfferGenerator(data);
      const writer = new TsvFileWriter(filename);

      await writer.write(generator.generateMany(count));

      console.info(
        chalk.green(`Сгенерировано предложений: ${count}. Файл: ${filename}`)
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        chalk.red(`Ошибка генерации: ${message}`)
      );
    }
  }
}
