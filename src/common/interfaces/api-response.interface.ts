import type { ErrorResponse } from './error-response.interface';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  message?: string;
}
