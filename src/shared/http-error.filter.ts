import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";
import { getLoggerHost } from "./req.util";

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.log(JSON.stringify(exception), "HttpErrorFilter");

    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    const status = exception
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message.error || exception.message || null
        : "Internal server error";

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    const errorResponse = getLoggerHost(host, status, message);

    Logger.error(
      JSON.stringify(errorResponse),
      JSON.stringify(exception),
      "ExceptionFilter"
    );
    if (request) {
      response.status(status).json(errorResponse);
    }
  }
}
