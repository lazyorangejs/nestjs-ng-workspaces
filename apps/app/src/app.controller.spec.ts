import { USER_SERVICE_TOKEN } from '@lazyorange/domain'
import { createMockUserService } from '@lazyorange/users-typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from '@lazyorange/auth'
import { UsersModule } from '@lazyorange/users-sequelize'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const usersModule = UsersModule.register({
      dbSettings: {
        dialect: 'sqlite',
        database: 'tmp/db-sequelize.testing.sqlite',
        synchronize: true,
      },
    })

    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthModule.register({ usersModule })],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: USER_SERVICE_TOKEN,
          useValue: createMockUserService(),
        },
      ],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello world!"', () => {
      expect(appController.getHello()).toBe('Hello world!')
    })
  })
})
