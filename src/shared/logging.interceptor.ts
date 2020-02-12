import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GqlExecutionContext } from "@nestjs/graphql";
import { getLoggerInfo } from "./req.util";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const { method, url, ctxName, now } = getLoggerInfo(context);
    return next
      .handle()
      .pipe(
        tap(() => Logger.log(`${method} ${url} ${Date.now() - now}ms`, ctxName))
      );
  }
}
