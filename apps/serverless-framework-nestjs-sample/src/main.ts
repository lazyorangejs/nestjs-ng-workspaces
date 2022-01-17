/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'

import { Context } from 'aws-lambda'
import { eventContext } from 'aws-serverless-express/middleware'
import serverlessExpress from '@vendia/serverless-express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.use(eventContext())
  await app.init()

  return serverlessExpress({ app: app.getHttpAdapter().getInstance() })
}

let cachedServer

export async function handler(event: unknown, context: Context, callback) {
  if (!cachedServer) {
    cachedServer = await bootstrap()
  }
  return cachedServer(event, context, callback)
}
