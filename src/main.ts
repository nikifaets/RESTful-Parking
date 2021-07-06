import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ParkingModule } from './parking/parking.module';


async function bootstrap() {

  const app = await NestFactory.create(ParkingModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(3000);
}
bootstrap();
