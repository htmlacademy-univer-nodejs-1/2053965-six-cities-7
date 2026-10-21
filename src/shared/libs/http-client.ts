import axios from 'axios';
import type {MockServerData} from '../types/mock-server-data.type.js';

const RESOURCE_NAMES = [
  'titles',
  'descriptions',
  'cities',
  'previewImages',
  'photos',
  'types',
  'amenities',
  'users',
] as const;

export class HttpClient {
  public async get(url: string): Promise<MockServerData> {
    const baseUrl = url.replace(/\/$/, '');

    const entries = await Promise.all(
      RESOURCE_NAMES.map(async (resourceName) => {
        const response = await axios.get(`${baseUrl}/${resourceName}`);

        return [resourceName, response.data] as const;
      })
    );

    return Object.fromEntries(entries) as MockServerData;
  }
}
