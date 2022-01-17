import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getData(): { message: string } {
    return {
      message:
        process.env.GREETING_MESSAGE ??
        'Welcome to serverless-framework-nestjs-sample!',
    }
  }
}
