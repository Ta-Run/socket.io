import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Tarun',
      database: 'tracker',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // WARNING: set to false in production
    }),
    UserModule,
  ],
})
export class AppModule { }
