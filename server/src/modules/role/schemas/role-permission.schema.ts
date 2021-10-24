import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import * as mongoose from 'mongoose';
import { BaseModel } from '../../../common/model.schema';
import { Permission } from './../../permission/schemas/permission.schema';
import { Role } from './role.schema';

export type RolePermissionDocument = RolePermission & Document;

@ObjectType()
@Schema()
export class RolePermission extends BaseModel {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    index: true,
  })
  @Field()
  @Expose()
  role: Role;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    index: true,
  })
  @Field()
  @Expose()
  permission: Permission;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);
