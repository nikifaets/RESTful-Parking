import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from '../vehicle/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Lab08:securepwd@cluster0.83zms.mongodb.net/Lab08Garage?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{name: Vehicle.name, schema: VehicleSchema}])
    ],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class GarageModule {}
 