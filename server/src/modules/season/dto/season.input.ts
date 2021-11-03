import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
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
  description: string;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  @Min(2010, { message: 'Lớn hơn 2010' })
  @Max(2030, { message: 'Nhỏ hơn 2030' })
  year: number;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  number: number;

  @IsNotEmpty({ message: 'Vui lòng nhập giải đấu' })
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
  description: string;

  @Field()
  @IsNumber({}, { message: 'Vui lòng nhập kiểu số' })
  @Min(2010, { message: 'Lớn hơn 2010' })
  @Max(2030, { message: 'Nhỏ hơn 2030' })
  year: number;

  @Field()
  number: number;

  @IsNotEmpty({ message: 'Vui lòng nhập giải đấu' })
  @IsObjectID('giải đấu')
  @Field()
  tournamentId: string;
}
