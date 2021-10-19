import { IS_PUBLIC_KEY } from './../../shared/decorators/isPublic.decorator';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
