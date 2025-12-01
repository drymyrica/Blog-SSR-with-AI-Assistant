import Redis from 'ioredis';
import { config } from 'dotenv';
config();

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: false
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (e) => console.error('Redis error', e));

export default redis;
