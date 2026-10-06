export type UserType = 'regular' | 'pro';

export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: UserType;
};

export function isUserType(value: string): value is UserType {
  return value === 'regular' || value === 'pro';
}
