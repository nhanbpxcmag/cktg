import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RegionModule } from './modules/region/region.module';
import { RoleModule } from './modules/role/role.module';
import { SeasonModule } from './modules/season/season.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { UserModule } from './modules/user/user.module';
import { NestCommandModule } from './nest-command/nest-command.module';
import config from './shared/config/config';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { TeamModule } from './modules/team/team.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { customFormatLog } from './common/logger/format.logger';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            customFormatLog.format.errorFileLogFormat(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          options: {},
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            customFormatLog.format.errorFileLogFormat(true),
          ),
        }),
      ],
    }),
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
    TeamModule,
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
