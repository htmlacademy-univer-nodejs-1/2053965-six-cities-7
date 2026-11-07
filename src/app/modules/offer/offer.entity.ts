import {prop, modelOptions, defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {
  City,
  OfferType,
  Amenity,
  Coordinates,
  getCities,
  getOfferTypes, getAmenities
} from '../../../shared/types/index.js';

import {UserEntity} from '../user/user.entity.js';

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  })
  public title!: string;

  @prop({
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1024,
  })
  public description!: string;

  @prop({ required: true, })
  public postDate!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: getCities(),
  })
  public city!: City;

  @prop({
    required: true,
    match: [
      /\.(jpg|jpeg|png)$/i,
      'Превью изображение должно быть в формате jpg, jpeg или png'
    ],
  })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String],
  })
  public photos!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, min: 0, max: 5 })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: getOfferTypes(),
  })
  public type!: OfferType;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({
    required: true,
    type: () => [String],
    enum: getAmenities(),
  })
  public amenities!: Amenity[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public author!: Ref<UserEntity>;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({
    required: true,
    type: () => Object,
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
