import {createWriteStream} from 'node:fs';
import { mkdir } from 'node:fs/promises';
import {dirname} from 'node:path';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import type {Offer} from '../../types/index.js';
import type {FileWriterInterface} from './file-writer.inteface.js';

export class TsvFileWriter implements FileWriterInterface {
  public constructor(private readonly filename: string) {
  }

  public async write(offers: Iterable<Offer>): Promise<void> {
    try {
      await mkdir(dirname(this.filename), { recursive: true });

      await pipeline(
        Readable.from(this.toLines(offers)),
        createWriteStream(this.filename, {encoding: 'utf8'})
      );
    } catch (error) {
      throw new Error(
        `Не удалось записать файл ${this.filename}. ${
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        }`
      );
    }
  }

  private* toLines(offers: Iterable<Offer>): Generator<string> {
    for (const offer of offers) {
      yield `${this.toTsvRow(offer)}\n`;
    }
  }

  private toTsvRow(offer: Offer): string {
    return [
      offer.title,
      offer.description,
      offer.postDate.toISOString(),
      offer.city,
      offer.previewImage,
      offer.photos.join(';'),
      offer.isPremium,
      offer.isFavorite,
      offer.rating,
      offer.type,
      offer.rooms,
      offer.guests,
      offer.price,
      offer.amenities.join(';'),
      offer.author.name,
      offer.author.email,
      offer.author.avatar ?? '',
      offer.author.password,
      offer.author.type,
      offer.commentsCount,
      offer.coordinates.latitude,
      offer.coordinates.longitude,
    ].join('\t');
  }
}
