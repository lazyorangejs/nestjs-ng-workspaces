import {
  CreateUser,
  Email,
  IUserService,
  makeEmail,
  makeUsername,
  User,
  UserFields,
  UserFieldsAll,
  UserId,
  USER_SERVICE_TOKEN,
  makeUserId,
} from '@lazyorange/domain'
import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { UserEntity } from './entity/user.entity'
import { UsersService } from './users.service'
import { v4 } from 'uuid'

export const testsDbSettings: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'tmp/db-for-tests.sqlite',
  synchronize: true,
}

// it's good candidate to move it to test helpers library
export const createUserService = async (
  dbSettings: TypeOrmModuleOptions = testsDbSettings
): Promise<IUserService> => {
  const providers = [
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UsersService,
    },
  ]

  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        ...dbSettings,
        entities: [UserEntity],
      }),
      TypeOrmModule.forFeature([UserEntity]),
    ],
    providers,
  }).compile()

  const service = module.get<IUserService>(USER_SERVICE_TOKEN)
  return service
}

class MockUserService implements IUserService {
  private readonly users: Map<Email, User> = new Map()
  private readonly usersById: Map<UserId, User> = new Map()

  findByEmail(email: Email, _fields: UserFields): Promise<User | null> {
    return Promise.resolve(this.users.get(email))
  }

  findById(id: UserId): Promise<User> {
    return Promise.resolve(this.usersById.get(id))
  }

  createUser(data: Partial<CreateUser>): Promise<User> {
    const email = makeEmail(data.email)

    this.users.set(makeEmail(email), {
      email,
      username: makeUsername(data.username),
      id: makeUserId(v4()),
    })

    this.usersById.set(this.users.get(email).id, this.users.get(email))

    return this.findByEmail(email, UserFieldsAll)
  }
}

export const createMockUserService = async () => new MockUserService()
