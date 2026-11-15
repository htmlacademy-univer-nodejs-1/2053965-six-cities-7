import {City, Amenity, Coordinates, OfferType} from '../../../../shared/types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public type?: OfferType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public amenities?: Amenity[];
  public coordinates?: Coordinates;
}
