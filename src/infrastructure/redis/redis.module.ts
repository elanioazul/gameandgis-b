import { Module } from '@nestjs/common';
import { RedisRepository } from './repository/redis.repository';
import { redisClientFactory } from './redis.client.factory';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository],
})
export class RedisModule {}
