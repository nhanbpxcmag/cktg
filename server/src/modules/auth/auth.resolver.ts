import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../user/dto/user.input';
import { LoginInput } from './../user/dto/user.input';
import { UserResponse } from './../user/dto/user.response';
import { AuthService } from './auth.service';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserResponse, { name: 'register' })
  async register(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ): Promise<UserResponse> {
    const user = await this.authService.create(createUserInput);
    const token = await this.authService.createToken({
      userId: user._id,
      username: user.username,
      email: user.email,
    });
    return { ...user, token };
  }

  @Mutation(() => UserResponse, { name: 'login' })
  async login(
    @Args('loginInput')
    loginInput: LoginInput,
  ): Promise<UserResponse> {
    const { usernameOrEmail, password } = loginInput;
    const user = await this.authService.login(usernameOrEmail, password);
    return user;
  }
}
