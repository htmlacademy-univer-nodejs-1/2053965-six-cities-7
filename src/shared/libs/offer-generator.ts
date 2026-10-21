import type {MockServerData, Offer} from '../types/index.js';
import {getRandomItem, getRandomItems, getRandomNumber, getRandomFloat, getRandomBoolean, getRandomDate} from './helpers/random.js';

export class OfferGenerator {
  constructor(private readonly data: MockServerData) {}

  public generate(): Offer {
    const city = getRandomItem(this.data.cities);
    const user = getRandomItem(this.data.users);

    return {
      title: getRandomItem(this.data.titles),
      description: getRandomItem(this.data.descriptions),
      postDate: getRandomDate(new Date(2020, 0, 1), new Date()),
      city: city.name,
      previewImage: getRandomItem(this.data.previewImages),
      photos: getRandomItems(this.data.photos),
      isPremium: getRandomBoolean(),
      isFavorite: getRandomBoolean(),
      rating: getRandomFloat(1, 5, 1),
      type: getRandomItem(this.data.types),
      rooms: getRandomNumber(1, 8),
      guests: getRandomNumber(1, 10),
      price: getRandomNumber(100, 100000),
      amenities: getRandomItems(this.data.amenities),
      author: user,
      commentsCount: 0,
      coordinates: {
        latitude: city.latitude,
        longitude: city.longitude,
      },
    };
  }

  public *generateMany(count: number): Generator<Offer> {
    for (let index = 0; index < count; index++) {
      yield this.generate();
    }
  }
}
