import { Public } from './../../shared/decorators/isPublic.decorator';
import { LocalAuthGuard } from './../../shared/guards/local-auth.guard';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { UserResponse } from './../user/dto/user.response';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/login')
  async login(@Request() req): Promise<UserResponse> {
    const user: User = req.user;
    const token = await this.authService.createToken({
      userId: user._id,
      username: user.username,
      email: user.email,
    });
    return { ...user, token };
  }
}
