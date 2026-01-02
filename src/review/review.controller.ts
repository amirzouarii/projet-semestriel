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
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/guard/roles.decorator';
import type { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles('ADMIN', 'USER')
  create(@Body() dto: CreateReviewDto, @Req() req: RequestWithUser) {
    return this.reviewService.create(dto, req.user);
  }

  @Get()
  list(@Query() query: ReviewQueryDto) {
    return this.reviewService.list(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Get('vehicle/:vehicleId/average')
  getAverageRating(@Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.reviewService.getVehicleAverageRating(vehicleId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'USER')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
    @Req() req: RequestWithUser,
  ) {
    return this.reviewService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'USER')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.reviewService.delete(id, req.user);
  }

  @Patch(':id/verify')
  @Roles('ADMIN')
  verify(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.verify(id);
  }
}
