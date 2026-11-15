import {inject, injectable} from 'inversify';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {Logger} from '../../../shared/libs/index.js';
import {Component} from '../../../shared/types/index.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

const DEFAULT_COMMENT_COUNT = 50;

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel)
    private readonly commentModel: ReturnModelType<typeof CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const {authorId, ...commentData} = dto;
    const comment = await this.commentModel.create({...commentData, author: authorId});
    this.logger.info(`Добавлен комментарий к предложению: ${dto.offerId}`);

    return comment.populate('author');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: -1})
      .limit(DEFAULT_COMMENT_COUNT)
      .populate('author')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
