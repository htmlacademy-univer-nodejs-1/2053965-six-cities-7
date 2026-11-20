import {Container} from 'inversify';
import {Application} from '../application.js';
import {RestConfig} from '../config/index.js';
import type {Config, RestSchema} from '../config/index.js';
import {LoggerService, type Logger} from '../../shared/libs/index.js';
import {MongoDatabaseClient, type DatabaseClient} from '../database/index.js';
import {Component} from '../../shared/types/index.js';
import {AppExceptionFilter, type ExceptionFilter} from '../rest/index.js';
import {registerUserContainer} from '../modules/user/index.js';
import {registerOfferContainer} from '../modules/offer/index.js';
import {registerCommentContainer} from '../modules/comment/index.js';
import {registerFavoriteContainer} from '../modules/favorite/index.js';

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

container
  .bind<ExceptionFilter>(Component.ExceptionFilter)
  .to(AppExceptionFilter)
  .inSingletonScope();

registerUserContainer(container);
registerOfferContainer(container);
registerCommentContainer(container);
registerFavoriteContainer(container);

export {container};
