
import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const initRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '0.0.0.0',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }
  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};
