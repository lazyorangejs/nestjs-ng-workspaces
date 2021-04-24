// https://emojipedia.org/rocket/
import './envrionments/environment'

import { ShutdownSignal, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as pino from 'pino'
import { AppModule } from './app.module'
import { config } from './config'

async function bootstrap(port = 3000, level = 'debug') {
  const logger = pino({ level })
  const app = await NestFactory.create(AppModule)
  app.useLogger(logger)
  app.enableCors()
  // Nest.js will validate all incoming requests by using validation rules inside DTO,
  // we don't allow to process unknown properties to avoid situation when client sends requests
  // that can't be processed properly
  // @see https://docs.nestjs.com/techniques/validation#stripping-properties
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    })
  )
  app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM])

  await app.listen(port)
  logger.info({ port }, 'Server has been successfully started 🚀')

  setInterval(() => {
    logger.debug(
      `The server uses approximately ${Math.round(
        process.memoryUsage().rss / (1024 * 1024)
      )} MB`
    )
  }, 5000)
}

bootstrap(config.httpPort, config.loglevel)
