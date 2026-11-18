import {Container} from 'inversify';
import {Component} from '../../../shared/types/index.js';
import type {Controller} from '../../rest/index.js';
import {FavoriteController} from './favorite.controller.js';

export function registerFavoriteContainer(container: Container): void {
  container
    .bind<Controller>(Component.FavoriteController)
    .to(FavoriteController)
    .inSingletonScope();
}
