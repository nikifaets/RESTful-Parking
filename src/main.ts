import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GarageModule } from './parking/parking.module';


async function bootstrap() {

  const app = await NestFactory.create(GarageModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
