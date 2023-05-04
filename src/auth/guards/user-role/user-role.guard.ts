import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const roles: ValidRoles[] = this.reflector.get<ValidRoles[]>(
      META_ROLES,
      context.getHandler()
    );

    return user.roles.some((role) => roles.includes(role));
  }
}
