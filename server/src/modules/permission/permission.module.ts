import { Permission, PermissionSchema } from './schemas/permission.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Permission.name,
        useFactory: () => {
          const schema = PermissionSchema;
          schema.index({ code: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
  ],
  providers: [PermissionResolver, PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
