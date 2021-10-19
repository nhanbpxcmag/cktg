import { IS_PUBLIC_KEY } from './../decorators/isPublic.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      let mess = 'Vui lòng đăng nhập lại';
      if (info.name === 'TokenExpiredError') {
        mess = 'Phiên đăng nhập hết hạn';
      } else if (info.name === 'Error') {
        mess = 'Vui lòng đăng nhập';
      }
      throw err || new UnauthorizedException(mess);
    }
    return user;
  }
}
