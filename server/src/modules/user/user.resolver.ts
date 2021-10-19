import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { PayloadDto } from './dto/token.payload';
import { User } from './schemas/user.schema';
import { CurrentUser } from './user.current';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: PayloadDto) {
    const { userId } = user;
    return await this.userService.getUserById(userId);
  }
}
