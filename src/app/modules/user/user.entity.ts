import {prop, modelOptions, defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {getUserTypes, User, UserType} from '../../../shared/types/index.js';
import {createHash} from 'node:crypto';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Пожалуйста, укажите корректный email',
    ],
  })
  public email!: string;

  @prop({
    required: false,
    match: [/\.(jpg|jpeg|png)$/i, 'Аватар должен быть в формате jpg, jpeg или png'],
  })
  public avatar?: string;

  @prop({
    required: true,
    minlength: 6,
  })
  public password!: string;

  @prop({
    required: true,
    type: () => String,
    enum: getUserTypes(),
  })
  public type!: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string): void {
    this.password = createHash('sha256').update(password + salt).digest('hex');
  }

  public getPassword(): string {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
