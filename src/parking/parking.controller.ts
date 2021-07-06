import { Controller, Delete, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CreateVehicleDTO } from '../vehicle/dto/create-vehicle.dto';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {

    constructor(private parkingService: ParkingService) {}

    @Get()
    async countFreeSpots(): Promise<Object> {
        const freeSpots = await this.parkingService.countFreeSpots();
        return {freeSpots: freeSpots};
    }

    @Get('getPrice')
    getCurrentPrice(@Query('id') id: number): Promise<Object> {
        return this.parkingService.calculatePrice(id);  
    }

    @Post()
    addToParking(@Body() createVehicleDTO: CreateVehicleDTO): Promise<Object> {
        return this.parkingService.create(createVehicleDTO);
    }

    @Delete('delete/')
    removeFromParking(@Query('id') id) {
        return this.parkingService.delete(id);
    }

}