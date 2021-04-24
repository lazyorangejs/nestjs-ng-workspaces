import { DynamicModule, Module } from '@nestjs/common'
import { AUTH_SERVICE_TOKEN } from '@lazyorange/domain'
import { AuthService } from './auth.service'

const providers = [
  {
    provide: AUTH_SERVICE_TOKEN,
    useClass: AuthService,
  },
]

@Module({})
export class AuthModule {
  public static register(
    options: Required<{
      usersModule: DynamicModule
    }>
  ): DynamicModule {
    return {
      imports: [options.usersModule],
      module: AuthModule,
      providers: [...providers],
      exports: providers,
    }
  }
}
