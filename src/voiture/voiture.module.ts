import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoitureController } from './voiture.controller';
import { VoitureService } from './voiture.service';
import { Vehicules } from 'src/entities/vehicules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicules])],
  controllers: [VoitureController],
  providers: [VoitureService]
})
export class VoitureModule {}
