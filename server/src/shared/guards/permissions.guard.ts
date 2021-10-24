import { PayloadDto } from './../../modules/user/dto/token.payload';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSIONS_KEY } from './../decorators/permission.decorator';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IPermission } from 'src/common/interfaces/permission.enum';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<IPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    let user: PayloadDto;
    if (context.getType().toString() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      user = ctx.getContext().req;
    } else {
      user = context.switchToHttp().getRequest().user;
    }

    return false;
  }
}
