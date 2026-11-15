import {prop, modelOptions, defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/index.js';
import {OfferEntity} from '../offer/index.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1024,
  })
  public text!: string;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public author!: Ref<UserEntity>;

  @prop({
    ref: OfferEntity,
    required: true,
  })
  public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
