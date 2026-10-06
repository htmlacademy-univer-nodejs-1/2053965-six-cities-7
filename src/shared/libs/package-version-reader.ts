import { readFileSync } from 'node:fs';

export type PackageJson = { version: string };

export function isPackageJson(value: unknown): value is PackageJson {
  return typeof value === 'object' && value !== null && 'version' in value && typeof value.version === 'string';
}

export class PackageVersionReader {
  constructor(private readonly filepath: string) {}

  public read(): string {
    const content = readFileSync(this.filepath, 'utf-8');
    const parsedData: unknown = JSON.parse(content);

    if (!isPackageJson(parsedData)) {
      throw new Error(
        'Файл package.json имеет некорректную структуру.'
      );
    }

    return parsedData.version;
  }
}
