import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request) {
      const { authorization } = request.headers;
      console.log(authorization);
      if (!authorization) {
        return false;
      }
      const decoded = await this.validateToken(authorization);
      (<any>request).user = decoded;
      return true;
    } else {
      const ctx = GqlExecutionContext.create(context).getContext();
      const { authorization } = ctx.headers;
      console.log(authorization);
      if (!authorization) {
        return false;
      }
      const decoded = await this.validateToken(authorization);
      (<any>ctx).user = decoded;
      return true;
    }
  }

  async validateToken(authorization: string) {
    const auths = authorization.split(" ");
    if (auths[0] !== "Bearer") {
      throw new HttpException("Invalid token", HttpStatus.FORBIDDEN);
    }
    const token = auths[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      return decoded;
    } catch (err) {
      const message = "Token error:" + (err.message || err.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
