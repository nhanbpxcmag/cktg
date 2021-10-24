import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { NestCommandModule } from './nest-command/nest-command.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RegionModule } from './modules/region/region.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import config from './shared/config/config';
import { APP_GUARD } from '@nestjs/core';
import { TournamentModule } from './modules/tournament/tournament.module';
import { SeasonModule } from './modules/season/season.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: false,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
          extensions: {
            success: false,
            timestamp: new Date().toLocaleString(),
            ...error.extensions,
          },
        };
        return graphQLFormattedError;
      },
    }),
    MongooseModule.forRoot(config.mongodb.uri, {
      keepAlive: true,
      autoIndex: true,
      keepAliveInitialDelay: 300000,
      useNewUrlParser: true,
    }),
    UserModule,
    AuthModule,
    RegionModule,
    PermissionModule,
    RoleModule,
    NestCommandModule,
    TournamentModule,
    SeasonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
