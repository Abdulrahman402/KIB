import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const now = Date.now();

    if (request.url.includes('/health') || request.url.includes('/metrics')) {
      return next.handle();
    }

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    // Log request body for POST/PUT/PATCH (be careful with sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const sanitizedBody = this.sanitizeBody(body);
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    // Log query params and route params if present
    if (Object.keys(query).length) {
      this.logger.debug(`Query Params: ${JSON.stringify(query)}`);
    }
    if (Object.keys(params).length) {
      this.logger.debug(`Route Params: ${JSON.stringify(params)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;

          this.logger.log(
            `Outgoing Response: ${method} ${url} - Status: ${statusCode} - ${responseTime}ms`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;

          this.logger.error(
            `Error Response: ${method} ${url} - ${responseTime}ms`,
            error.stack,
          );
        },
      }),
    );
  }

  /**
   * Sanitize request body to exclude sensitive fields
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'newPassword',
      'oldPassword',
      'currentPassword',
      'confirmPassword',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
    ];

    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
