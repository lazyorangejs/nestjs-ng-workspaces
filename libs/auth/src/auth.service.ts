import {
  IAuthService,
  IUserService,
  JSONWebToken,
  User,
  UserCredentials,
  USER_SERVICE_TOKEN,
} from '@lazyorange/domain'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: IUserService
  ) {}

  public async login(creds: UserCredentials): Promise<JSONWebToken> {
    const user = await this.userService.findByEmail(creds.email, ['id'])
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return 'token'
  }

  public async signup(data: UserCredentials): Promise<User> {
    const user = await this.userService.findByEmail(data.email, ['id'])
    if (user) {
      throw new BadRequestException('User is already exist with given email')
    }
    return this.userService.createUser(data)
  }
}
