import chalk from 'chalk';
import 'dotenv/config';
import type { Offer } from '../../shared/types/index.js';
import type { Command } from './command.interface.js';
import {DatabaseClient, MongoDatabaseClient} from '../../app/database/index.js';
import {OfferModel, OfferService, OfferServiceInterface} from '../../app/modules/offer/index.js';
import {UserModel, UserService, UserServiceInterface} from '../../app/modules/user/index.js';
import {TsvFileReader, Logger, LoggerService} from '../../shared/libs/index.js';

export class ImportCommand implements Command {
  private databaseClient: DatabaseClient;
  private userService: UserServiceInterface;
  private offerService: OfferServiceInterface;
  private readonly logger: Logger;
  private readonly salt = process.env.SALT ?? '';

  constructor() {
    this.logger = new LoggerService();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new UserService(this.logger, UserModel);
    this.offerService = new OfferService(this.logger, OfferModel);
  }

  getName(): string {
    return '--import';
  }

  async execute(...parameters: string[]) {
    const [filename, login, password, host, dbName] = parameters;

    if (!filename) {
      console.error(chalk.red('Укажите путь к TSV-файлу.'));
      return;
    }

    if (!login || !password || !host || !dbName) {
      console.error(chalk.red('Укажите все параметры подключения к базе данных: login, password, host, dbName.'));
      return;
    }

    const databaseUri = `mongodb://${encodeURIComponent(login)}:${encodeURIComponent(password)}@${host}:27017/${dbName}?authSource=admin`;
    let count = 0;

    try {
      await this.databaseClient.connect(databaseUri);
      const fileReader = new TsvFileReader(filename.trim());

      for await (const offer of fileReader.read()) {
        await this.importOffer(offer, this.salt);
        count++;
      }

      console.info(
        chalk.bold.green(`Импортировано предложений: ${count}`)
      );
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Неизвестная ошибка';

      console.error(chalk.red(`Ошибка импорта: ${message}`));
    } finally {
      await this.databaseClient.disconnect();
    }
  }

  private async importOffer(offer: Offer, salt: string): Promise<void> {
    const user = await this.userService.findOrCreate(offer.author, salt);
    await this.offerService.create({ ...offer, author: user.id });
  }
}

