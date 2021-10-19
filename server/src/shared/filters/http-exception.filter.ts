import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
      if (typeof exception.message !== 'string') {
        exception.message = 'Bạn không có quyền truy cập chức năng này';
      }
    }
    if (host.getType<GqlContextType>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const path = gqlHost.getInfo().path;
      console.log(exception);
      return exception;
    } else {
      res.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        exception: exception.name,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: req ? req.url : null,
      });
    }
  }
}
