import { IsNumber } from 'class-validator';
import { Region } from './../../region/schemas/region.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { BaseModel } from '../../../common/model.schema';

export type TournamentDocument = Tournament & Document;

@ObjectType()
@Schema()
export class Tournament extends BaseModel {
  @Prop({ required: true, index: true })
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
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
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

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
