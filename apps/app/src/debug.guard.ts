import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class DebugGuard implements CanActivate {
  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    return false
  }
}
