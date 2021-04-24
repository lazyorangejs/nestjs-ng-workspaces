import { USER_SERVICE_TOKEN } from '@lazyorange/domain'
import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize'
import { UserModel } from './user.model'
import { UserService } from './user.service'

const defaultDbSettings: SequelizeModuleOptions = {
  dialect: 'sqlite',
  database: 'tmp/db-sequelize.sqlite',
  logging: true,
  synchronize: true,
}

const providers = [
  {
    provide: USER_SERVICE_TOKEN,
    useClass: UserService,
  },
]

@Module({})
export class UsersModule {
  static register(
    options: { dbSettings: SequelizeModuleOptions } = {
      dbSettings: defaultDbSettings,
    }
  ): DynamicModule {
    return {
      imports: [
        SequelizeModule.forRoot({
          ...options.dbSettings,
          models: [UserModel],
        }),
        SequelizeModule.forFeature([UserModel]),
      ],
      module: UsersModule,
      providers,
      exports: providers,
    }
  }
}
