import type { User } from './user.type';

export type Comment = {
  text: string;
  postDate: Date;
  rating: number;
  author: User;
};
