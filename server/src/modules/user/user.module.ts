import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.constroller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
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
