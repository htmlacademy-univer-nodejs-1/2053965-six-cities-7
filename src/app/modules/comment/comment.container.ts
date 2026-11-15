import {Container} from 'inversify';
import type {ReturnModelType} from '@typegoose/typegoose';
import {Component} from '../../../shared/types/index.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentService} from './comment.service.js';
import {CommentEntity, CommentModel} from './comment.entity.js';

export function registerCommentContainer(container: Container): void {
  container
    .bind<CommentServiceInterface>(Component.CommentService)
    .to(CommentService)
    .inSingletonScope();

  container
    .bind<ReturnModelType<typeof CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);
}
