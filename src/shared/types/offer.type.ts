import type { City } from './city.type.js';
import type { OfferType } from './offer-type.type.js';
import type { Amenity } from './amenity.type.js';
import type { Coordinates} from './coordinates.type.js';
import type { User } from './user.type.js';

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
