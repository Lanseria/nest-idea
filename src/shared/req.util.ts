import { ArgumentsHost, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext, GqlArgumentsHost } from "@nestjs/graphql";

export const getLoggerInfo = (ctx: ArgumentsHost) => {
  let method = "";
  let url = "";
  let ctxName = "";
  const now = Date.now();
  const req: Request = ctx.switchToHttp().getRequest();
  if (req) {
    method = req.method;
    url = req.url;
    ctxName = (ctx as ExecutionContext).getClass().name;
  } else {
    const context = GqlExecutionContext.create(ctx as ExecutionContext);
    ctxName = (ctx as any).constructorRef?.name;
    const info = context.getInfo();
    url = info.fieldName;
    method = info.parentType;
  }
  return { method, url, ctxName, now };
};

export const getLoggerHost = (
  host: ArgumentsHost,
  status: number,
  message: string
) => {
  const ctx = host.switchToHttp();
  const request: Request = ctx.getRequest();
  if (request) {
    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: message,
      type: "rest"
    };
    return errorResponse;
  } else {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const url = info.fieldName;
    const method = info.parentType;
    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: url,
      method: method,
      message: message,
      type: "graphql"
    };
    return errorResponse;
  }
};
