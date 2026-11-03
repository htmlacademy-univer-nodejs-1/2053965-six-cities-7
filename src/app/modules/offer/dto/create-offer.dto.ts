import {City, Amenity, User, Coordinates, OfferType} from '../../../../shared/types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: City;
  public previewImage!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: OfferType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: Amenity[];
  public author!: User;
  public commentsCount!: number;
  public coordinates!: Coordinates;
}
