import { ValidationPipe } from '@nestjs/common';
import { IsIn } from 'class-validator';
import { ConfigService } from '@nestjs/config'

export class CreateVehicleDTO{

    constructor(private configService: ConfigService) {}

    @IsIn(['A', 'B', 'C'])
    category: string;

    @IsIn(['silver', 'gold', 'platinum', 'none'])
    premium: string;
    
}