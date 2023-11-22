import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('LISTEN_PORT') || 3000;
  console.log(`Listening on port ${port}`)

  // enable validation pipeline (TODO: skip validation of mongo id's) -->
  // app.useGlobalPipes(new ValidationPipe({
  //   disableErrorMessages: false,
  // }));

  await app.listen(port);
}
bootstrap();
