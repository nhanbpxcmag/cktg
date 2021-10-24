import { Controller, Get, Request, UseGuards } from '@nestjs/common';

@Controller()
export class UserController {
  @Get('user/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
