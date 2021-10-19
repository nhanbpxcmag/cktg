import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import config from './shared/config/config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
