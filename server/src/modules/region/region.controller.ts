import { PermissionsGuard } from './../../shared/guards/permissions.guard';
import { Permissions } from './../../shared/decorators/permission.decorator';
import { IPermission } from './../../common/interfaces/permission.enum';
import { JwtAuthGuard } from './../../shared/guards/jwt-auth.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';

@Controller()
export class RegionController {
  @Get('region')
  @UseGuards(JwtAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions(IPermission.Admin)
  getProfile(@Request() req) {
    return req.user;
  }
}
