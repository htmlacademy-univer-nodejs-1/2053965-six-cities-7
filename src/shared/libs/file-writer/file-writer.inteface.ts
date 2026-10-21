import type {Offer} from '../../types/index.js';
export interface FileWriterInterface {
  write(offers: Iterable<Offer>): Promise<void>;
}
