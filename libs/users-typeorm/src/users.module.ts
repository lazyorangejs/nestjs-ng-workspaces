import { USER_SERVICE_TOKEN } from '@lazyorange/domain'
import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { UsersService } from './users.service'

const providers = [
  {
    provide: USER_SERVICE_TOKEN,
    useClass: UsersService,
  },
]

const defaultDbSettings: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'tmp/db.sqlite',
  synchronize: true,
}

@Module({})
export class UsersModule {
  static register(
    options: { dbSettings: TypeOrmModuleOptions } = {
      dbSettings: defaultDbSettings,
    }
  ): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRoot({
          ...options.dbSettings,
          entities: [UserEntity],
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      module: UsersModule,
      providers,
      exports: providers,
    }
  }
}
