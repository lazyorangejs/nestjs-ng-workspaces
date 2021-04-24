import {
  IUserService,
  makeEmail,
  makeUserId,
  User,
  UserFieldsAll,
} from '@lazyorange/domain'
import { createUserService } from './jest.helpers'

import { v4 } from 'uuid'

describe('UsersService', () => {
  let service: IUserService

  const createUser: () => Promise<User> = async () => {
    const user = await service.createUser({
      username: 'bruce.wayne',
      email: 'bruce.wayne@gmail.com',
      password: 'password1!',
    })
    return user
  }

  beforeAll(async () => {
    service = await createUserService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('#createUser', () => {
    it('should create and return an user entity', async () => {
      const user = await service.createUser({
        username: 'bruce.wayne',
        email: 'bruce.wayne@gmail.com',
        password: 'password1!',
      })
      expect(user).toMatchObject({
        username: 'bruce.wayne',
        email: 'bruce.wayne@gmail.com',
      })
      expect(user).toHaveProperty('id')
    })
  })

  describe('#findById', () => {
    it('should return a user by given id', async () => {
      const bruce = await createUser()
      const user = await service.findById(bruce.id)
      expect(user).toMatchObject(bruce)
    })

    it('should return null', async () => {
      const user = await service.findById(makeUserId(v4()))
      expect(user).toBeNull()
    })
  })

  describe('#findByEmail', () => {
    it('should return a user by given email', async () => {
      const bruce = await createUser()
      const user = await service.findByEmail(bruce.email, UserFieldsAll)
      expect(user).toMatchObject(bruce)
    })

    it('should return null', async () => {
      const user = await service.findByEmail(
        makeEmail('fake@gmail.com'),
        UserFieldsAll
      )
      expect(user).toBeNull()
    })
  })
})
