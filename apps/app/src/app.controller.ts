import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationShutdown,
  Param,
  Post,
} from '@nestjs/common'
import {
  LoginDTO,
  IUserService,
  UserId,
  USER_SERVICE_TOKEN,
  SignUpDTO,
  User,
  IAuthService,
  AUTH_SERVICE_TOKEN,
} from '@lazyorange/domain'

import { AppService } from './app.service'

const logger = console

@Controller()
export class AppController implements OnApplicationShutdown {
  constructor(
    private readonly appService: AppService,
    @Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService,
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/users/:userId')
  getUserInfoById(@Param('userId') id: UserId): Promise<User> {
    return this.userService.findById(id)
  }

  @Post('/login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(body)
  }

  @Post('/signup')
  signup(@Body() body: SignUpDTO): Promise<User> {
    return this.authService.signup(body)
  }

  public onApplicationShutdown() {
    logger.debug(
      'I`ve received shutdown signal, add specific logic to close all connections '
    )
  }
}
