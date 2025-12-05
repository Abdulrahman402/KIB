import {
  Injectable,
  ExecutionContext,
  CallHandler,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {}

  private generateCacheKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const { method, url, query } = request;

    // Generate semantic cache keys based on the route
    let cacheKey = `${method}:${url}`;

    // Add query parameters to the key if they exist
    const queryString = Object.keys(query || {})
      .sort()
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    if (queryString) {
      cacheKey += `?${queryString}`;
    }

    return cacheKey;
  }

  private isMeaningfulValue(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return false;
      }
    }

    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }

    return true;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.generateCacheKey(context);

    if (!key) {
      return next.handle();
    }

    const cachedValue = await this.cacheManager.get(key);
    if (cachedValue !== null && cachedValue !== undefined) {
      return of(cachedValue);
    }

    return next.handle().pipe(
      tap(async (response) => {
        if (this.isMeaningfulValue(response)) {
          const ttl = this.reflector.get(
            CACHE_TTL_METADATA,
            context.getHandler(),
          );

          await this.cacheManager.set(key, response, ttl);
        }
      }),
    );
  }
}
