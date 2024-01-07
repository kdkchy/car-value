import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      
      synchronize: process.env.NODE_ENV === 'test' ? true : false,
      migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
      keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
    };
  }
}