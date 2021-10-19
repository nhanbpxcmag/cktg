import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import config from '../../shared/config/config';
import { CreateUserInput } from '../user/dto/user.input';
import { User } from '../user/schemas/user.schema';
import { IError } from './../../common/interfaces/error.interface';
import { ERROR_CONSTANT } from './../../constants';
import { comparePassword } from './../../shared/utils/hash.util';
import { PayloadDto } from './../user/dto/token.payload';
import { UserResponse } from './../user/dto/user.response';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  async validateUser(usernameOrEmail: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );
    if (
      user &&
      (await comparePassword(password, user.password, config.salt_password))
    ) {
      return user;
    }
    const message: IError = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: [
        {
          value: usernameOrEmail,
          property: 'usernameOrEmail',
          constraints: {
            usernameOrEmail: `Thông tin đăng nhập không chính xác`,
          },
        },
      ],
      error: ERROR_CONSTANT.VALIDATION_INPUT,
    };
    throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
  }

  async createToken(payload: PayloadDto) {
    return await this.jwtService.signAsync(payload);
  }

  async login(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserResponse> {
    const user = await this.validateUser(usernameOrEmail, password);

    const token = await this.createToken({
      userId: user._id,
      username: user.username,
      email: user.email,
    });
    return { ...user, token };
  }
}
