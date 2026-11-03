const userTypes = ['regular', 'pro'] as const;
export type UserType = (typeof userTypes)[number];

export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: UserType;
};

export function isUserType(value: string): value is UserType {
  return userTypes.includes(value as UserType);
}

export function getUserTypes(): UserType[] {
  return [...userTypes];
}
