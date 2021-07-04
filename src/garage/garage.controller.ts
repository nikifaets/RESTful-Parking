import { Controller, Delete, Get, Post, Param, Body } from '@nestjs/common';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';


@Controller('garage')
export class GarageController {

    @Get()
    countFreeSpots(): number{

        return 1;
    }

    @Get(':id')
    getCurrentPrice(@Param('id') id: number): number{
        
        console.log(`Request price for car with id ${id}`);
        return 1;
    }

    @Post()
    addToParking(@Body() createVehicleDTO: CreateVehicleDTO): string{

        return `A car has been added with type ${createVehicleDTO.type}.`;
    }

    @Delete(':id')
    removeFromParking(@Param('id') id: number): number{

        
        return 1;
    }
}


