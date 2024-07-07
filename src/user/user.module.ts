import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { EmailService } from 'src/email/email.service';
import { ProducerService } from 'src/queues/producer.service';
import { ConsumerService } from 'src/queues/consumer.service';
import { RedisOptions } from 'src/configs/app-options.constants';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    EmailModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, ProducerService, ConsumerService],
  exports: [EmailService],
})
export class UserModule {}
