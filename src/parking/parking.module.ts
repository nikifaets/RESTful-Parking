import { Module } from '@nestjs/common';
import { GarageController } from './garage.controller';
import { GarageService } from './garage.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(
    'mongodb+srv://Lab08:securepwd@cluster0.83zms.mongodb.net/Lab08Garage?retryWrites=true&w=majority',
)],
  controllers: [GarageController],
  providers: [GarageService],
})
export class GarageModule {}
 