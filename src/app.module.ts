import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VoitureModule } from './voiture/voiture.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'prj_voitures',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // toutes les entités automatiquement
      synchronize: true,
      logging: true, // utile pour voir les requêtes SQL
    }),
    AuthModule,
    VoitureModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
