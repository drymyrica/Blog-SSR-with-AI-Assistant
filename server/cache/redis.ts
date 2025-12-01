import Redis from 'ioredis'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

const redis = new Redis({
  host: config.redisHost,
  port: Number(config.redisPort),
})

export default redis
