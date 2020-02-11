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

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const now = Date.now();
    if (req) {
      const method = req.method;
      const url = req.url;
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${method} ${url} ${Date.now() - now}ms`,
              context.getClass().name
            )
          )
        );
    } else {
      const ctx = GqlExecutionContext.create(context);
      const resolverName = (ctx as any).constructorRef.name;
      const info = ctx.getInfo();
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${info.parentType} "${info.fieldName}" ${Date.now() - now}ms`,
              resolverName
            )
          )
        );
    }
  }
}
