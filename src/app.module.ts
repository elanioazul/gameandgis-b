import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RolesModule } from './roles/roles.module';
import { ProvidersModule } from './providers/providers.module';
import { AvatarsModule } from './avatars/avatars.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      // logging: true,
      // logger: 'advanced-console',
    }),
    IamModule,
    RedisModule,
    RolesModule,
    ProvidersModule,
    AvatarsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/avatars'), // Specify the root path for static files
      serveRoot: '/uploads/avatars', // Specify the route prefix
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
