import {
  Email,
  IUserService,
  mapToUser,
  User,
  UserFields,
  UserFieldsAll,
  UserId,
  makeUserId,
} from '@lazyorange/domain'

import { InjectModel } from '@nestjs/sequelize'
import { UserModel } from './user.model'
import { v4 } from 'uuid'
import { OnApplicationBootstrap } from '@nestjs/common'

export class UserService implements IUserService, OnApplicationBootstrap {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel
  ) {}

  async onApplicationBootstrap() {
    await this.userModel.sequelize.sync()
  }

  async findByEmail(email: Email, fields: UserFields): Promise<User> {
    const rec = await this.userModel.findOne({
      where: { email },
      attributes: fields,
    })
    if (rec) {
      return mapToUser(rec)
    }
    return null
  }

  async findById(id: UserId): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    })
  }

  async createUser(data: Partial<User>): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = this.userModel.build({ ...data, id: makeUserId(v4()) })
    await user.save()
    return this.findByEmail(data.email, UserFieldsAll)
  }
}
