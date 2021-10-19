import { AuthModule } from './../auth/auth.module';
import { UserController } from './user.constroller';
import { hashPassword } from './../../shared/utils/hash.util';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import config from '../../shared/config/config';
import { Connection } from 'mongoose';
// import * as autoIncrement from 'mongoose-auto-increment';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.index({ username: 1, email: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
  ],
  providers: [UserResolver, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
