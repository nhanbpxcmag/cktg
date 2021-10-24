import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateRegionInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên khu vực' })
  name: string;
}
@InputType()
export class UpdateRegionInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập id' })
  _id: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên khu vực' })
  name: string;
}
