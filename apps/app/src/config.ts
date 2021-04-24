/* eslint-disable no-process-env */

const httpPort = parseInt(process.env.PORT, 10) || 3000
const loglevel = process.env.LOG_LEVEL || 'debug'

export const config: { httpPort: number; loglevel: string } = {
  httpPort,
  loglevel,
}
