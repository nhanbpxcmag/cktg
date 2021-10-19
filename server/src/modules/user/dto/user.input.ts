import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(4, 15, { message: 'Tên người dùng từ 4 - 15 ký tự' })
  @Matches('^([a-z0-9])*[a-z0-9]+.[a-z0-9]+$', '', {
    message:
      "Tên người dùng gồm: dấu '.', ký tự thường, số. Khi bắt đầu và kết thúc bằng dấu '.'",
  })
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Vui lòng nhập Email' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mật khẩu' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập họ' })
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập tên' })
  lastName: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Tên tài khoản hoặc Email' })
  usernameOrEmail: string;

  @Field()
  @IsNotEmpty({ message: 'Vui lòng nhập Mật khẩu' })
  password: string;
}
