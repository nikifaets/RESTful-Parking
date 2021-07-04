import { NestFactory } from '@nestjs/core';
import { GarageModule } from './parking/parking.module';


async function bootstrap() {

  const app = await NestFactory.create(GarageModule);
  await app.listen(3000);
}
bootstrap();
