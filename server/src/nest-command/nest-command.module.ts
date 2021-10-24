import { SeedCommand } from './command-seed.service';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [CommandModule, PermissionModule, RoleModule, UserModule],
  providers: [SeedCommand],
  exports: [SeedCommand],
})
export class NestCommandModule {}
