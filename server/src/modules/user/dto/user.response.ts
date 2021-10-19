import { User } from '../schemas/user.schema';
import { Field, ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class UserResponse extends PartialType(User) {
  @Field()
  token: string;
}
