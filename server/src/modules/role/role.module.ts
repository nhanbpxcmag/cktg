import { UserModule } from './../user/user.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import {
  RolePermission,
  RolePermissionSchema,
} from './schemas/role-permission.schema';
import { RoleUser, RoleUserSchema } from './schemas/role-user.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: () => {
          const schema = RoleSchema;
          schema.index({ code: 1 }, { unique: true });
          return schema;
        },
      },
      {
        name: RoleUser.name,
        useFactory: () => {
          const schema = RoleUserSchema;
          schema.index({ role: 1, user: 1 }, { unique: true });
          return schema;
        },
      },
      {
        name: RolePermission.name,
        useFactory: () => {
          const schema = RolePermissionSchema;
          schema.index({ role: 1, permission: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
    PermissionModule,
    UserModule,
  ],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
