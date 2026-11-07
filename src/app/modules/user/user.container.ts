import {Container} from 'inversify';
import {UserServiceInterface} from './user-service.interface.js';
import {Component} from '../../../shared/types/index.js';
import {UserService} from './user.service.js';
import type {ReturnModelType} from '@typegoose/typegoose';
import {UserEntity, UserModel} from './user.entity.js';

export function registerUserContainer(userContainer: Container): void {
  userContainer
    .bind<UserServiceInterface>(Component.UserService)
    .to(UserService)
    .inSingletonScope();

  userContainer
    .bind<ReturnModelType<typeof UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);
}
