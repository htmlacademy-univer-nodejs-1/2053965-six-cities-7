import {Container} from 'inversify';
import {Application} from '../application.js';
import {RestConfig} from '../config/index.js';
import type {Config, RestSchema} from '../config/index.js';
import {LoggerService, type Logger} from '../../shared/libs/index.js';
import {MongoDatabaseClient, type DatabaseClient} from '../database/index.js';
import {Component} from '../../shared/types/index.js';
import {registerUserContainer} from '../modules/user/user.container.js';
import {registerOfferContainer} from '../modules/offer/offer.container.js';

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

container
  .bind<DatabaseClient>(Component.DatabaseClient)
  .to(MongoDatabaseClient)
  .inSingletonScope();

registerUserContainer(container);
registerOfferContainer(container);

export {container};
