import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch(MongooseError, MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongooseError | MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    let errors: string[] | undefined;

    if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;

      message = 'Validation failed';

      errors = Object.values(exception.errors).map((err) => err.message);
    } else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;

      message = `Invalid ${exception.path}: ${exception.value}`;
    } else if ((exception as any).code === 11000) {
      status = HttpStatus.CONFLICT;

      const field = Object.keys((exception as any).keyPattern)[0];

      message = `${field} already exists`;
    } else if (exception instanceof MongooseError) {
      message = exception.message;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error: exception.name,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
