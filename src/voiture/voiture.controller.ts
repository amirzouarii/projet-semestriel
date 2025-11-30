import { Body, Controller, Get, Post } from '@nestjs/common';
import { VoitureService } from './voiture.service';
import { Vehicules } from 'src/entities/user/vehicules.entity';

@Controller('voiture')
export class VoitureController {
    constructor(private readonly voitureService: VoitureService) { }


    @Get()
    getVoitures(): Promise<Vehicules[]> {
        return this.voitureService.findAll();
    }

    @Post()
    createVoiture(@Body() voitureData: Partial<Vehicules>): Promise<Vehicules> {
        return this.voitureService.create(voitureData);
    }
}
