import type { City } from './city.type';
import type { OfferType } from './offer-type.type';
import type { Amenity } from './amenity.type';
import type { Coordinates} from './coordinates.type';
import type { User } from './user.type';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates;
};
