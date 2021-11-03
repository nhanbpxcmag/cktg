import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsObjectID } from 'src/shared/decorators/class-validator.decorator';
@InputType()
export class CreateTeamInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên' })
  name: string;

  @Field()
  description: string;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  number: number;

  @IsNotEmpty({ message: 'Vui lòng nhập khu vực' })
  @IsObjectID('khu vực')
  @Field()
  regionId: string;
}

@InputType()
export class UpdateTeamInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập id' })
  @IsObjectID()
  _id: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên' })
  name: string;

  @Field()
  description: string;

  @Field()
  number: number;

  @IsNotEmpty({ message: 'Vui lòng nhập khu vực' })
  @IsObjectID('khu vực')
  @Field()
  regionId: string;
}
