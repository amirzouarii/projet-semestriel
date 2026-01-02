import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/guard/roles.decorator';
import type { RequestWithUser } from 'src/common/types/request-with-user';
import {
  CreateReservationDto,
  ReservationQueryDto,
  UpdateReservationStatusDto,
} from './dto/reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles('ADMIN', 'USER')
  create(
    @Body() dto: CreateReservationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.reservationService.create(dto, req.user);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  list(
    @Query() query: ReservationQueryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.reservationService.list(query, req.user);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.reservationService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @Roles('ADMIN', 'USER')
  cancel(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.reservationService.cancel(id, req.user);
  }
}
