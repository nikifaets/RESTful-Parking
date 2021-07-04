import { Controller, Delete, Get, Post, Param } from '@nestjs/common';


@Controller('garage')
export class GarageController {

    @Get()
    countFreeSpots(): number{

        return 1;
    }

    @Get(':id')
    getCurrentPrice(@Param('id') id: number): number{
        
        console.log("Request price for car with id #${id}");
        return 1;
    }

    @Post()
    addToParking(): string{

        return "A car has been added.";
    }

    @Delete()
    removeFromParking(): number{

        
        return 1;
    }
    }


