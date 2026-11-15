import { inject, injectable } from 'inversify';
import { DocumentType, ReturnModelType} from '@typegoose/typegoose';
import { Logger } from '../../../shared/libs/index.js';
import { Component } from '../../../shared/types/index.js';
import {UserServiceInterface} from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import type { OfferEntity } from '../offer/index.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: ReturnModelType<typeof UserEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Создан новый пользователь: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email: email.trim().toLowerCase(), }).exec();
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);
    if (user) {
      return user;
    }
    return this.create(dto, salt);
  }

  public async verifyUser(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(email);

    if (!user || !user.verifyPassword(password, salt)) {
      return null;
    }

    return user;
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel
      .findById(userId)
      .populate<{ favorites: DocumentType<OfferEntity>[] }>('favorites')
      .exec();

    return user?.favorites ?? [];
  }

  public async addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $addToSet: { favorites: offerId } }, { new: true })
      .exec();
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $pull: { favorites: offerId } }, { new: true })
      .exec();
  }
}
