import { plainToClass } from 'class-transformer';
import { hashPassword } from './../../shared/utils/hash.util';
import { UserDocument } from './schemas/user.schema';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { IError } from './../../common/interfaces/error.interface';
import { ERROR_CONSTANT } from './../../constants';
import { CreateUserInput } from './dto/user.input';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from '../../shared/config/config';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(
    createUserInput: CreateUserInput,
    return_error = true,
  ): Promise<User | null> {
    const { username, email, password, firstName, lastName } = createUserInput;
    const existingUser = await this.userModel
      .findOne({
        username,
      })
      .lean()
      .exec();

    if (existingUser) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          {
            value: existingUser.username === username ? username : email,
            property: existingUser.username === username ? 'username' : 'email',
            constraints: {
              usernameOrEmail: `${
                existingUser.username === username ? 'Tên tài khoản' : 'Email'
              } đã tồn tại`,
            },
          },
        ],
        error: ERROR_CONSTANT.VALIDATION_INPUT,
      };
      if (return_error) {
        throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
      } else {
        return null;
      }
    }
    const hash_password = await hashPassword(password, config.salt_password);
    const newUser: UserDocument = await new this.userModel({
      username,
      password: hash_password,
      email,
      firstName,
      lastName,
    }).save();
    return newUser.toObject();
  }

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    const user = await this.userModel
      .findOne(
        usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      )
      .lean()
      .exec();
    return plainToClass(User, user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean().exec();
    return plainToClass(User, user);
  }
  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).lean().exec();
    return plainToClass(User, user);
  }
}
