import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: true; data: unknown; meta?: Record<string, unknown> }> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (payload && typeof payload === 'object' && 'success' in payload) {
          return payload as { success: true; data: unknown; meta?: Record<string, unknown> };
        }

        if (payload && typeof payload === 'object' && 'data' in payload) {
          const normalized = payload as { data: unknown; meta?: Record<string, unknown> };
          return {
            success: true,
            data: normalized.data,
            ...(normalized.meta ? { meta: normalized.meta } : {}),
          };
        }

        return {
          success: true,
          data: payload,
        };
      }),
    );
  }
}
