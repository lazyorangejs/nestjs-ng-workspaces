import { Controller, Post, Param, UseGuards } from '@nestjs/common'

import { DebugGuard } from '../debug.guard'

@Controller({ path: 'debug' })
@UseGuards(DebugGuard)
export class DebugController {
  private arr: Buffer[] = []

  @Post('/alloc/:memory')
  allocBuffer(@Param('memory') memory = 1): void {
    // eslint-disable-next-line no-param-reassign
    memory = memory <= 0 ? 1 : memory
    // eslint-disable-next-line no-param-reassign
    memory = memory >= 1024 ? 1024 : memory

    this.arr.push(Buffer.alloc(memory * 1024 * 1024).fill('x'))
  }
}
