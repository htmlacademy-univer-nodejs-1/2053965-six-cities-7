export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number, decimal = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimal));
}

export function getRandomItem<T>(items: readonly T[]): T {
  return items[getRandomNumber(0, items.length - 1)];
}

export function getRandomItems<T>(items: readonly T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const count = getRandomNumber(1, shuffled.length);
  return shuffled.slice(0, count);
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  return new Date(getRandomNumber(startTime, endTime));
}
