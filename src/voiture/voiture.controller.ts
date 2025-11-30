import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

    @Put()
    updateVoiture(@Body() voitureData: Partial<Vehicules>): Promise<Vehicules> {
        return this.voitureService.update(voitureData);
    }

    
 @Delete(':id')
  async deleteVoiture(@Param('id') id: number): Promise<{ message: string }> {
    await this.voitureService.delete(id);
    return { message: `Voiture avec id ${id} supprimée avec succès` };
  }



}
