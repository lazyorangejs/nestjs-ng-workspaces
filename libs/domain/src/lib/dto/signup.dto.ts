import { Transform } from 'class-transformer'

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPassword2,
} from '@lazyorange/infrastructure'

import { SignUp } from '../auth'
import { Email, makeEmail } from '../common'
import { Username } from '@lazyorange/domain'

export class SignUpDTO implements SignUp {
  @IsEmail()
  @Transform(({ value }) => makeEmail(value))
  email: Email

  @IsPassword2()
  password: string

  @IsOptional()
  @IsNotEmpty()
  username?: Username
}
