import chalk from 'chalk';
import type { Offer } from '../../shared/types/index.js';
import type { Command } from './command.interface.js';
import { TsvFileReader } from '../../shared/libs/index.js';

export class ImportCommand implements Command {
  getName(): string {
    return '--import';
  }

  execute(...parameters: string[]) {
    const [filename] = parameters;

    if (!filename) {
      console.error(chalk.red('Укажите путь к TSV-файлу.'));
      return;
    }

    const fileReader = new TsvFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray();

      console.info(
        chalk.bold.green(`Импортировано предложений: ${offers.length}`)
      );

      offers.forEach((offer, index) => this.printOffer(offer, index + 1));
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Неизвестная ошибка';

      console.error(chalk.red(`Ошибка импорта: ${message}`));
    }
  }

  private printOffer(offer: Offer, index: number): void {
    console.info('');
    console.info(chalk.bold.cyan(`Предложение ${index}`));
    console.info('');

    console.info(chalk.bold(`Название: ${offer.title}`));
    console.info(`Описание: ${offer.description}`);
    console.info(`Город: ${offer.city}`);
    console.info(`Тип жилья: ${offer.type}`);
    console.info(`Дата публикации: ${offer.postDate.toLocaleDateString('ru-RU')}`);

    console.info('');
    console.info(chalk.bold('Характеристики:'));
    console.info(`  Цена: ${offer.price}`);
    console.info(`  Комнаты: ${offer.rooms}`);
    console.info(`  Гости: ${offer.guests}`);
    console.info(`  Рейтинг: ${offer.rating}`);
    console.info(`  Premium: ${offer.isPremium ? 'да' : 'нет'}`);
    console.info(`  Избранное: ${offer.isFavorite ? 'да' : 'нет'}`);
    console.info(`  Комментариев: ${offer.commentsCount}`);

    console.info('');
    console.info(chalk.bold('Удобства:'));
    console.info(`  ${offer.amenities.join(', ') || 'не указаны'}`);

    console.info('');
    console.info(chalk.bold('Автор:'));
    console.info(`  Имя: ${offer.author.name}`);
    console.info(`  Email: ${offer.author.email}`);
    console.info(`  Тип: ${offer.author.type}`);
    console.info(`  Аватар: ${offer.author.avatar ?? 'не указан'}`);

    console.info('');
    console.info(chalk.bold('Координаты:'));
    console.info(`  Широта: ${offer.coordinates.latitude}`);
    console.info(`  Долгота: ${offer.coordinates.longitude}`);

    console.info('');
    console.info(chalk.bold('Фотографии:'));
    offer.photos.forEach((photo) => {
      console.info(`  - ${photo}`);
    });
  }
}

