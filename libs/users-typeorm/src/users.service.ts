import { Injectable } from '@nestjs/common'
import {
  CreateUser,
  Email,
  IUserService,
  makeEmail,
  mapToUser,
  User,
  UserFields,
  UserFieldsAll,
  UserId,
} from '@lazyorange/domain'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from './entity/user.entity'
import { v4 } from 'uuid'

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  async findById(
    id: UserId,
    fields: UserFields = UserFieldsAll
  ): Promise<User> {
    const rec = await this.userRepo.findOne(id, { select: fields })
    if (rec) {
      return mapToUser(rec)
    }
    return null
  }

  async createUser(data: Partial<CreateUser>): Promise<User> {
    await this.userRepo.insert({ ...data, id: v4() })
    return this.findByEmail(makeEmail(data.email))
  }

  async findByEmail(email: Email): Promise<User | null> {
    const rec = await this.userRepo.findOne({ where: { email } })
    if (rec) {
      return mapToUser(rec)
    }
    return null
  }
}
