import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        // If response already has the ApiResponse structure, return it as is
        if (response && typeof response === 'object' && 'success' in response) {
          return response as ApiResponse<T>;
        }

        // If response has { data, message } structure
        if (response && typeof response === 'object' && 'data' in response) {
          return {
            success: true,
            data: response.data as T,
            message: response.message || 'Request successful',
          };
        }

        // Otherwise, wrap the entire response as data
        return {
          success: true,
          data: response as T,
          message: 'Request successful',
        };
      }),
    );
  }
}
