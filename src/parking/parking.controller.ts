import { Controller, Delete, Get, Post, Param, Body } from '@nestjs/common';
import { CreateVehicleDTO } from '../vehicle/dto/create-vehicle.dto';
import { ParkingService } from './parking.service';
import { Vehicle } from '../vehicle/schemas/vehicle.schema';

@Controller('parking')
export class ParkingController {

    constructor(private parkingService: ParkingService) {}

    @Get()
    countFreeSpots(): Promise<number> {

        return this.parkingService.countFreeSpots();
    }

    @Get(':id')
    getCurrentPrice(@Param('id') id: number): Promise<number> {
        console.log(`Request price for car with id ${id}`);

        return this.parkingService.calculatePrice(id);
    }

    @Post()
    addToParking(@Body() createVehicleDTO: CreateVehicleDTO): Promise<Vehicle> {
        return this.parkingService.create(createVehicleDTO);
    }

    @Delete('delete/:id')
    removeFromParking(@Param('id') id) {
        return this.parkingService.delete(id);
    }
}