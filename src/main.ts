import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common';
import * as cf from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const serverConfig = cf.get('server');
  var port = serverConfig['port'];
  app.enableCors();
  await app.listen(port);
  logger.log(`Application listenning on port ${port}`)
}
bootstrap();
