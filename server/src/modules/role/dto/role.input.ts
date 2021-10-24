import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateRoleInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên' })
  code: string;
}
