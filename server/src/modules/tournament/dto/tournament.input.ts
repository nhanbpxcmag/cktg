import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { IsObjectID } from 'src/shared/decorators/class-validator.decorator';
@InputType()
export class CreateTournamentInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên' })
  name: string;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  number: number;

  @IsObjectID('khu vực')
  @Field()
  regionId: string;
}

@InputType()
export class UpdateTournamentInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập id' })
  @IsObjectID()
  _id: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên khu vực' })
  name: string;

  @Field()
  number: number;

  @Field()
  @IsObjectID('khu vực')
  regionId: string;
}
