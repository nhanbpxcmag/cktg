import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import * as mongoose from 'mongoose';

@ObjectType()
@Schema({ id: false })
export abstract class BaseModel {
  @Field((type) => ID)
  @Transform(({ value, key, obj }) => {
    return obj['_id'] instanceof mongoose.Types.ObjectId
      ? obj['_id'].toHexString()
      : obj['_id'];
  })
  @Expose()
  _id: string;

  @Prop({ default: Date.now() })
  @Field()
  @Expose()
  createdAt?: Date;

  @Prop({ default: Date.now() })
  @Field()
  @Expose()
  updatedAt?: Date;
}
