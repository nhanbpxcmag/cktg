import { IsNotEmpty, IsNumber, Matches, Length } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { IsObjectID } from 'src/shared/decorators/class-validator.decorator';
@InputType()
export class CreateSeasonInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mã' })
  code: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên' })
  name: string;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  @Length(4, 4, { message: 'Gồm 4 ký tự' })
  year: number;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  number: number;

  @IsObjectID('giải đấu')
  @Field()
  tournamentId: string;
}

@InputType()
export class UpdateSeasonInput {
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

  @IsObjectID('giải đấu')
  @Field()
  tournamentId: string;
}
