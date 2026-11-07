import * as Mongoose from 'mongoose';
import {injectable, inject} from 'inversify';
import type {DatabaseClient} from './database-client.interface.js';
import type {Logger} from '../../shared/libs/index.js';
import {Component} from '../../shared/types/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private isConnected = false;
  private readonly retryCount = 5;
  private readonly retryDelay = 1000;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      this.logger.info('Клиент MongoDB уже подключен');
      return;
    }


    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      this.logger.info(`Попытка подключения к MongoDB (${attempt}/${this.retryCount})...`);
      try {
        await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Подключение к MongoDB успешно установлено');
        return;
      } catch (error) {
        const connectionError = error instanceof Error
          ? error
          : new Error('Неизвестная ошибка подключения к MongoDB');

        this.logger.error(`Ошибка при подключении к MongoDB. Попытка ${attempt} из ${this.retryCount}`, connectionError);
        if (attempt < this.retryCount) {
          this.logger.info(`Повторная попытка через ${this.retryDelay} мс...`);
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    throw new Error(`Не удалось подключиться к MongoDB после ${this.retryCount} попыток`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      this.logger.info('Клиент MongoDB уже отключен');
      return;
    }

    try {
      await Mongoose.disconnect();
      this.isConnected = false;
      this.logger.info('Соединение с MongoDB закрыто');
    } catch (error) {
      const disconnectError = error instanceof Error
        ? error
        : new Error('Неизвестная ошибка отключения от MongoDB');

      this.logger.error(
        'Не удалось закрыть соединение с MongoDB.',
        disconnectError,
      );

      throw disconnectError;
    }
  }
}
