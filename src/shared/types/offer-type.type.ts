export const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;

export type OfferType = (typeof OFFER_TYPES)[number];

export function isOfferType(value: string): value is OfferType {
  return OFFER_TYPES.some((type) => type === value);
}
