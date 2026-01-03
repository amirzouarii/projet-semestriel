import { Controller, Get, Query, Req } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Roles } from 'src/common/guard/roles.decorator';
import type { RequestWithUser } from 'src/common/types/request-with-user';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	@Roles('ADMIN', 'USER')
	me(@Req() req: RequestWithUser) {
		return this.usersService.findProfile(req.user.userId);
	}

	@Get()
	@Roles('ADMIN')
	list(@Query() query: PaginationQueryDto) {
		return this.usersService.findAll(query);
	}
}
