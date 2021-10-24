import { Query, Resolver } from '@nestjs/graphql';
import { PayloadDto } from './dto/token.payload';
import { User } from './schemas/user.schema';
import { CurrentUser } from '../../shared/decorators/user.current';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  async me(@CurrentUser() user: PayloadDto) {
    const { userId } = user;
    return await this.userService.getUserById(userId);
  }
}
