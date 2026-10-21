import type {Amenity} from './amenity.type.js';
import type {City} from './city.type.js';
import type {OfferType} from './offer-type.type.js';
import type {User} from './user.type.js';

export type MockCity = {
  name: City;
  latitude: number;
  longitude: number;
};

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: MockCity[];
  previewImages: string[];
  photos: string[];
  types: OfferType[];
  amenities: Amenity[];
  users: User[];
};
