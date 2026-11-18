import {Expose, Type} from 'class-transformer';
import type {Amenity, City, Coordinates, OfferType} from '../../../../shared/types/index.js';
import {UserRdo} from '../../user/index.js';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite = false;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public amenities!: Amenity[];

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public coordinates!: Coordinates;
}
