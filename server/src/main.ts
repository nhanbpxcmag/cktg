import * as dotenv from 'dotenv';
dotenv.config();
import config from './shared/config/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ValidationPipe } from './shared/pipes/validation.pipe';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  if (config.development) {
    app.useGlobalInterceptors(new LoggingInterceptor());
  }
  await app.listen(config.port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
      // const MongoClient = require('mongodb').MongoClient;
      // const mongo = new MongoClient(config.mongodb.uri, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // });
      // mongo.connect((err) => {
      //   console.log('Connected to MongoDB server ...');
      // });
    });
  }
}
bootstrap();
