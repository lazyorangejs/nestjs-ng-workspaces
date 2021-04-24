import { Email } from '../common'
import { UserCredentials } from '../auth'
import { IsEmail, IsPassword } from '@lazyorange/infrastructure'

export class LoginDTO implements UserCredentials {
  @IsEmail()
  email: Email

  @IsPassword()
  password: string
}
