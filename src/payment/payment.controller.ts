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
import { CreatePaymentDto, CompletePaymentDto, PaymentQueryDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
@Roles('ADMIN', 'USER')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto, @Req() req: RequestWithUser) {
    return this.paymentService.create(dto, req.user);
  }

  @Get()
  list(@Query() query: PaymentQueryDto, @Req() req: RequestWithUser) {
    return this.paymentService.list(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.paymentService.findOne(id, req.user);
  }

  @Patch(':id/complete')
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompletePaymentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentService.complete(id, dto, req.user);
  }

  @Patch(':id/fail')
  fail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompletePaymentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentService.fail(id, dto, req.user);
  }
}
