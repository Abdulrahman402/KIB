export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  errors?: string[];
  timestamp: string;
  path: string;
  method?: string;
}
