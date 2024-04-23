import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisRepositoryInterface } from '../interfaces/redis.repository.interface';
import { InvalidatedRefreshTokenError } from 'src/iam/models/refresh-token.error';

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
    //this.redisClient.quit();
  }

  //   async get(prefix: string, key: string): Promise<string | null> {
  //     return this.redisClient.get(`${prefix}:${key}`);
  //   }

  //   async set(prefix: string, key: string, value: string): Promise<void> {
  //     await this.redisClient.set(`${prefix}:${key}`, value);
  //   }

  //   async delete(prefix: string, key: string): Promise<void> {
  //     await this.redisClient.del(`${prefix}:${key}`);
  //   }

  //   async setWithExpiry(
  //     prefix: string,
  //     key: string,
  //     value: string,
  //     expiry: number,
  //   ): Promise<void> {
  //     await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  //   }

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
