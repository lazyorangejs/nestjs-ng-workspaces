import { Email } from './common'
import { User, Username } from './users'

export type UserCredentials = {
  email: Email
  password: string
}

export type SignUp = Required<UserCredentials> & Partial<{ username: Username }>

export type JSONWebToken = string

export interface IAuthService {
  signup(data: SignUp): Promise<User>

  login(creds: UserCredentials): Promise<JSONWebToken>
}
