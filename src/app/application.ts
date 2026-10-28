import {inject, injectable} from 'inversify';
import type {Config, RestSchema} from './config/index.js';
import type {Logger} from '../shared/libs/index.js';
import {Component} from '../shared/types/index.js';

@injectable()
export class Application {
  public constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  public init(): void {
    this.logger.info('Инициализация приложения...');
    this.logger.info(`Приложение ожидает подключений на порту ${this.config.get('port')}`);
  }
}
