export const AMENITIES = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
];

export type Amenity = (typeof AMENITIES)[number];

export function isAmenity(value: string): value is Amenity {
  return AMENITIES.some((amenity) => amenity === value);
}
