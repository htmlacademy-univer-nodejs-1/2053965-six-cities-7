import {injectable} from 'inversify';
import type {Config} from './config.interface.js';
import {configSchema, type RestSchema} from './rest-schema.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config = configSchema.getProperties();

  public get<K extends keyof RestSchema>(key: K): RestSchema[K] {
    return this.config[key];
  }
}
