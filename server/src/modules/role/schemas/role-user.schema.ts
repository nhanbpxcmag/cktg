import { User } from './../../user/schemas/user.schema';
import { Role } from './role.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import * as mongoose from 'mongoose';
import { BaseModel } from '../../../common/model.schema';

export type RoleUserDocument = RoleUser & Document;

@ObjectType()
@Schema()
export class RoleUser extends BaseModel {
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
    ref: 'User',
    index: true,
  })
  @Field()
  @Expose()
  user: User;
}

export const RoleUserSchema = SchemaFactory.createForClass(RoleUser);
