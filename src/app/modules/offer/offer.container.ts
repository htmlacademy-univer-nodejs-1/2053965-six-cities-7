import {Container} from 'inversify';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Component} from '../../../shared/types/index.js';
import {OfferService} from './offer.service.js';
import type {ReturnModelType} from '@typegoose/typegoose';
import {OfferEntity, OfferModel} from './offer.entity.js';
import type {Controller} from '../../rest/index.js';
import {OfferController} from './offer.controller.js';

export function registerOfferContainer(container: Container): void {
  container
    .bind<OfferServiceInterface>(Component.OfferService)
    .to(OfferService);

  container
    .bind<ReturnModelType<typeof OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);

  container
    .bind<Controller>(Component.OfferController)
    .to(OfferController)
    .inSingletonScope();
}
