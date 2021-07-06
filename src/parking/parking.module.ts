import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from '../vehicle/schemas/vehicle.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }), 

    MongooseModule.forFeature([{name: Vehicle.name, schema: VehicleSchema}]),
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: './config/.env',
      isGlobal: true
    })
    ],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class GarageModule {}
 