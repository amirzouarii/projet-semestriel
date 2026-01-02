import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { Roles } from 'src/common/guard/roles.decorator';
import { CreateVehicleDto, UpdateVehicleDto, VehicleQueryDto } from './dto/vehicle.dto';
import { VoitureService } from './voiture.service';

@Controller('vehicles')
export class VoitureController {
    constructor(private readonly voitureService: VoitureService) {}

    @Get()
    list(@Query() query: VehicleQueryDto) {
        return this.voitureService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.voitureService.findOne(id);
    }

    @Post()
    @Roles('ADMIN')
    create(@Body() dto: CreateVehicleDto) {
        return this.voitureService.create(dto);
    }

    @Patch(':id')
    @Roles('ADMIN')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehicleDto) {
        return this.voitureService.update(id, dto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.voitureService.delete(id);
        return { message: 'Vehicle deleted' };
    }
}
