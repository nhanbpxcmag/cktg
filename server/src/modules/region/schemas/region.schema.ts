import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';
import { BaseModel } from '../../../common/model.schema';

export type RegionDocument = Region & Document;

@ObjectType()
@Schema()
export class Region extends BaseModel {
  @Prop({ required: true })
  @Field()
  @Expose()
  code: string;

  @Prop({ required: true })
  @Field()
  @Expose()
  name: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
