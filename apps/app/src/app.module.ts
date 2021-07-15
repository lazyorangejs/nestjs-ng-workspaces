import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DebugService } from './debug/debug.service'
import { DebugModule } from './debug/debug.module'
// import { UsersModule as TypeOrmUserModule } from '@lazyorange/users-typeorm'
import { UsersModule as SequelizeUsersModule } from '@lazyorange/users-sequelize'
import { AuthModule } from '@lazyorange/auth'

import * as basicAuth from 'express-basic-auth'

// let's do hack, this module will be used by auth module as well
const UsersModule = SequelizeUsersModule.register({
  dbSettings: {
    dialect: 'sqlite',
    database: 'tmp/db-sequelize.sqlite',
    synchronize: true,
  },
})

@Module({
  imports: [
    DebugModule,
    UsersModule,
    AuthModule.register({ usersModule: UsersModule }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, DebugService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        basicAuth({
          authorizeAsync: true,
          authorizer: async (
            user: string,
            password: string,
            cb: basicAuth.AsyncAuthorizerCallback
          ) => {
            try {
              const ok = await AppController.verifyCredentials(user, password)
              return cb(null, ok)
            } catch (err) {
              return cb(null, false)
            }
          },
        })
      )
      .forRoutes('/debugger/*')
  }
}
