import { Expose, Transform } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from '../../../common/model.schema';

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User extends BaseModel {
  @Prop({ required: true, index: true })
  @Field()
  @Expose()
  username: string;

  @Prop({ required: true, index: true })
  @Field()
  @Expose()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  @Field()
  @Expose()
  firstName: string;

  @Prop({ required: true })
  @Field()
  @Expose()
  lastName: string;

  @Field()
  @Transform(({ value, key, obj }) => {
    return `${obj['firstName']} ${obj['lastName']}`;
  })
  @Expose()
  fullName: string;

  @Prop()
  @Field({ nullable: true })
  @Expose()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
