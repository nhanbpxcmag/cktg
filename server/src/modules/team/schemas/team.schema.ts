import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { BaseModel } from '../../../common/model.schema';
import { Region } from './../../region/schemas/region.schema';

export type TeamDocument = Team & Document;

@ObjectType()
@Schema()
export class Team extends BaseModel {
  @Prop({ required: true })
  @Field()
  @Expose()
  code: string;

  @Prop({ required: true })
  @Field()
  @Expose()
  name: string;

  @Prop()
  @Field()
  @Expose()
  description: string;

  @Prop()
  @Field()
  @Expose()
  number: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Region.name,
    index: true,
  })
  @Field({ nullable: true })
  @Expose()
  @Type(() => Region)
  region: Region;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
