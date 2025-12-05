import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const password = process.env.REDIS_PASSWORD;

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    // Only include password if it's set and not empty
    ...(password && password.trim() !== '' ? { password } : {}),
    ttl: parseInt(process.env.REDIS_TTL, 10) || 300,
  };
});
