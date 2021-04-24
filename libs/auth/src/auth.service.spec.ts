import { USER_SERVICE_TOKEN } from '@lazyorange/domain'
import { Test } from '@nestjs/testing'
import { createMockUserService } from '@lazyorange/users-typeorm'
import { AuthService } from './auth.service'

describe('Auth Test suite', () => {
  let service: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_SERVICE_TOKEN,
          useValue: createMockUserService(),
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
