import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let details: unknown;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObject = exceptionResponse as {
          message?: string | string[];
          error?: string;
          details?: unknown;
        };

        if (Array.isArray(responseObject.message)) {
          message = 'Validation failed';
          details = responseObject.message;
        } else if (responseObject.message) {
          message = responseObject.message;
        } else if (responseObject.error) {
          message = responseObject.error;
        } else {
          message = exception.message;
        }

        if (responseObject.details) {
          details = responseObject.details;
        }
      }
    }

    response.status(status).json({
      success: false,
      message,
      code: status,
      ...(details ? { details } : {}),
    });
  }
}
