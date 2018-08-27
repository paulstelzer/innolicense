import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  /**
   * Only if user has the role, he can proceed
   * @param context 
   */
  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = () => user.roles.some((role: string) => roles.includes(role));

    if (user && user.roles && hasRole()) {
      return true;
    } else {
      throw new HttpException({
        success: false,
        status: HttpStatus.UNAUTHORIZED,
        errorMessage: 'user/role_missing',
      }, 401);
    }
  }
}
