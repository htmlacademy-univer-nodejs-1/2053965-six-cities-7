import {Container} from 'inversify';
import {Application} from '../application.js';
import {RestConfig} from '../config/index.js';
import type {Config, RestSchema} from '../config/index.js';
import {LoggerService} from '../../shared/libs/index.js';
import type {Logger} from '../../shared/libs/index.js';
import {Component} from '../../shared/types/index.js';

const container = new Container();

container
  .bind<Application>(Component.Application)
  .to(Application)
  .inSingletonScope();

container
  .bind<Config<RestSchema>>(Component.Config)
  .to(RestConfig)
  .inSingletonScope();

container
  .bind<Logger>(Component.Logger)
  .to(LoggerService)
  .inSingletonScope();

export {container};
