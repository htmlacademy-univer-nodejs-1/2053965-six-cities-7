import {Expose} from 'class-transformer';
import type {City, OfferType} from '../../../../shared/types/index.js';

export class OfferShortRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public type!: OfferType;

  @Expose()
  public price!: number;

  @Expose()
  public city!: City;

  @Expose()
  public isFavorite = false;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public previewImage!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public commentsCount!: number;
}
