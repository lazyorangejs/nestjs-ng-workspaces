import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DebugService } from './debug/debug.service'
import { DebugModule } from './debug/debug.module'
// import { UsersModule as TypeOrmUserModule } from '@lazyorange/users-typeorm'
import { UsersModule as SequelizeUsersModule } from '@lazyorange/users-sequelize'
import { AuthModule } from '@lazyorange/auth'

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
  ],
  controllers: [AppController],
  providers: [AppService, DebugService],
})
export class AppModule {}
