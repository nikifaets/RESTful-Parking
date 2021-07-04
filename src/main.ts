import { NestFactory } from '@nestjs/core';
import { GarageModule } from './garage/garage/garage.module';


async function bootstrap() {
  const app = await NestFactory.create(GarageModule);
  await app.listen(3000);
}
bootstrap();
