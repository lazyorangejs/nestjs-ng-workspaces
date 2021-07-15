import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationShutdown,
  Param,
  Post,
  Req,
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
import { Bitbucket } from 'bitbucket'
import { createWriteStream } from 'fs'
import { getHeapSnapshot, getHeapStatistics } from 'v8'
import { hostname } from 'os'
import { IBasicAuthedRequest } from 'express-basic-auth'

const logger = console

class AppBuffer extends Buffer {}

@Controller()
export class AppController implements OnApplicationShutdown {
  private readonly leaks = []

  private _debuggerEnabled = false
  get debuggerEnabled() {
    if (this._debuggerEnabled === false) {
      this._debuggerEnabled = true // in order to don't send signal twice on concurrent requests
      this._debuggerEnabled = process.kill(process.pid, 'SIGUSR1')
    }
    return this._debuggerEnabled
  }

  constructor(
    private readonly appService: AppService,
    @Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService,
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('/leakmemory')
  leatMemory() {
    const memUsageBefore = this.getMemoryUsage()

    for (let idx = 0; idx < 1_000_000; idx++) {
      this.leaks.push({ appService: Object.create(this.appService) })
    }

    const memUsageAfter = this.getMemoryUsage()

    return {
      memUsageBefore,
      memUsageAfter,
      success: true,
    }
  }

  @Post('/truncateLeakedArray')
  truncateLeakedArray() {
    this.leaks.length = 0
    if (global.gc) {
      global.gc()
    }

    return { success: true }
  }

  @Post('/leakmemory/1')
  allocMemory() {
    const oneMg = 1 * 1024 * 1024
    this.leaks.push(AppBuffer.allocUnsafe(1024 * oneMg).fill(1))
  }

  public static async verifyCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const client = new Bitbucket({
      auth: {
        username,
        password,
      },
    })

    const data = await client.user.listEmails({})
    const record = data?.data?.values?.find((itm) => itm?.is_primary)
    return Boolean(record)
  }

  @Get('/debugger/memoryUsage')
  getMemoryUsage() {
    return {
      heapSizeLimit: `${(
        getHeapStatistics().heap_size_limit /
        1024 /
        1024
      ).toFixed(4)} MB`,
      ...Object.entries(process.memoryUsage()).reduce((acc, [key, value]) => {
        acc[key] = `${(value / 1024 / 1024).toFixed(4)} MB`
        return acc
      }, {}),
    }
  }

  @Get('/debugger/enable')
  async enableDebugger(@Req() req: IBasicAuthedRequest) {
    try {
      return {
        hostname: hostname(),
        username: req.auth?.user,
        remoteAddress: req.socket.remoteAddress,
        versions: { node: process.versions.node },
        pid: process.pid,
        ppid: process.pid,
        success: this.debuggerEnabled,
      }
    } catch (err) {
      return {
        msg: err?.message,
        success: false,
      }
    }
  }

  @Post('/createHeapSnapshot')
  createHeapSnapshot() {
    const memUsageBefore = this.getMemoryUsage()

    const snapshotStream = getHeapSnapshot()
    // It's important that the filename end with `.heapsnapshot`,
    // otherwise Chrome DevTools won't open it.
    const fileName = `tmp/${Date.now()}.heapsnapshot`
    const fileStream = createWriteStream(fileName)
    snapshotStream.pipe(fileStream)

    const memUsageAfter = this.getMemoryUsage()

    return {
      memUsageBefore,
      memUsageAfter,
      success: true,
    }
  }

  @Get('/hello/:username')
  sayHello(@Param('username') username: string): string {
    return `Hello, ${username}`
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
