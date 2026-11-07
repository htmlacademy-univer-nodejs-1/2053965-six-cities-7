export const Component = {
  Application: Symbol.for('Application'),
  Config: Symbol.for('Config'),
  Logger: Symbol.for('Logger'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel'),
} as const;
