import express, {Express} from 'express';
import {inject, injectable} from 'inversify';
import type {Config, RestSchema} from './config/index.js';
import {getMongoURI, type DatabaseClient} from './database/index.js';
import type {Logger} from '../shared/libs/index.js';
import {Component} from '../shared/types/index.js';
import type {ExceptionFilter} from './rest/index.js';

@injectable()
export class Application {
  private readonly server: Express;

  public constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  public async init(): Promise<void> {
    this.logger.info('Инициализация приложения...');

    this.logger.info('Подключение к базе данных...');
    await this.initDb();

    this.logger.info('Регистрация middleware...');
    this.initMiddleware();

    this.logger.info('Регистрация фильтров исключений...');
    this.initExceptionFilters();

    this.logger.info('Запуск сервера...');
    await this.initServer();

    this.logger.info(`Сервер запущен: http://localhost:${this.config.get('port')}`);
  }

  private async initDb(): Promise<void> {
    const mongoUri = getMongoURI(
      this.config.get('dbUser'),
      this.config.get('dbPassword'),
      this.config.get('dbHost'),
      this.config.get('dbPort'),
      this.config.get('dbName'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private initMiddleware(): void {
    this.server.use(express.json());
  }

  private initExceptionFilters(): void {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private initServer(): Promise<void> {
    const port = this.config.get('port');

    return new Promise((resolve, reject) => {
      this.server
        .listen(port, resolve)
        .once('error', reject);
    });
  }
}
