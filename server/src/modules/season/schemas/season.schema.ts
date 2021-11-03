import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Tournament } from 'src/modules/tournament/schemas/tournament.schema';
import { BaseModel } from '../../../common/model.schema';

export type SeasonDocument = Season & Document;

@ObjectType()
@Schema()
export class Season extends BaseModel {
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

  @Prop({ required: true })
  @Field()
  @Expose()
  year: number;

  @Prop()
  @Field()
  @Expose()
  number: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Tournament.name,
    index: true,
  })
  @Field({ nullable: true })
  @Expose()
  @Type(() => Tournament)
  tournament: Tournament;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
