import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

import { configDotenv } from 'dotenv';
configDotenv();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    abortOnError: false,
  });

  app.enableCors({
    origin: [process.env.FRONT_URL, process.env.NEST_DEVTOOL_URL],
    credentials: true,
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.use(helmet({}));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(process.env.HOST || 3001);
}
bootstrap().catch((err) => {
  process.exit(1);
});
