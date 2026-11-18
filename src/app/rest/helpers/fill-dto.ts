import {ClassConstructor, plainToInstance} from 'class-transformer';

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
  });
}
