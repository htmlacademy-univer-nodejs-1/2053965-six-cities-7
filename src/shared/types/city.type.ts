export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf'
] as const;

export type City = (typeof CITIES)[number];

export function isCity(value: string): value is City {
  return CITIES.some((city) => city === value);
}
