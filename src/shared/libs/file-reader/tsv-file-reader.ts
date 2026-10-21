import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {isAmenity, isCity, isOfferType, isUserType} from '../../types/index.js';
import type {Amenity, City, Offer, OfferType, UserType,} from '../../types/index.js';
import type {FileReaderInterface} from './file-reader.interface.js';

export class TsvFileReader implements FileReaderInterface<Offer> {
  public constructor(private readonly filename: string) {
  }

  public async *read(): AsyncGenerator<Offer> {
    const readStream = createReadStream(this.filename, {encoding: 'utf8'});

    const lineReader = createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    try {
      for await (const line of lineReader) {
        if (line.trim().length === 0) {
          continue;
        }

        yield this.parseOffer(line.split('\t'));
      }
    } finally {
      lineReader.close();
      readStream.destroy();
    }
  }

  private parseOffer(lines: string[]): Offer {
    if (lines.length !== 22) {
      throw new Error(
        `Некорректное количество полей: ожидалось 22, получено ${lines.length}`
      );
    }

    const [
      title,
      description,
      postDate,
      city,
      previewImage,
      photos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      amenities,
      authorName,
      authorEmail,
      authorAvatar,
      authorPassword,
      authorType,
      commentsCount,
      latitude,
      longitude,
    ] = lines.map((line) => line.trim());

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: this.parseCity(city),
      previewImage,
      photos: photos.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number(rating),
      type: this.parseOfferType(type),
      rooms: Number(rooms),
      guests: Number(guests),
      price: Number(price),
      amenities: amenities.split(';').map((amenity) => this.parseAmenity(amenity)),
      author: {
        name: authorName,
        email: authorEmail,
        avatar: authorAvatar,
        password: authorPassword,
        type: this.parseUserType(authorType),
      },
      commentsCount: Number(commentsCount),
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    };
  }

  private parseCity(value: string): City {
    if (!isCity(value)) {
      throw new Error(`Неизвестный город: ${value}`);
    }

    return value;
  }

  private parseOfferType(value: string): OfferType {
    if (!isOfferType(value)) {
      throw new Error(`Неизвестный тип жилья: ${value}`);
    }

    return value;
  }

  private parseUserType(value: string): UserType {
    if (!isUserType(value)) {
      throw new Error(`Неизвестный тип пользователя: ${value}`);
    }

    return value;
  }

  private parseAmenity(value: string): Amenity {
    const amenity = value.trim();
    if (!isAmenity(amenity)) {
      throw new Error(`Неизвестное удобство: ${amenity}`);
    }

    return amenity;
  }
}
