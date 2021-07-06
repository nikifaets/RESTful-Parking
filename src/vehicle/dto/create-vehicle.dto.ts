import { ValidationPipe } from '@nestjs/common';
import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateVehicleDTO{

    @IsIn(['A', 'B', 'C'])
    @IsNotEmpty()
    category: string;

    @IsIn(['silver', 'gold', 'platinum', 'none'])
    @IsNotEmpty()
    premium: string;
    
}