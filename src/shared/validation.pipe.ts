import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Logger.log(`1. ${JSON.stringify(value)}`, "ValidationPipe");
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        "Validation failed: No body submitted",
        HttpStatus.BAD_REQUEST
      );
    }
    const { metatype } = metadata;
    // Logger.log(`2: ${JSON.stringify(metadata)}`, "ValidationPipe");
    // Logger.log(`2.1: ${JSON.stringify(metatype)}`, "ValidationPipe");
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    // Logger.log(`3: ${JSON.stringify(errors)}`, "ValidationPipe");
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors
      .map(err => {
        for (const property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(", ");
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
