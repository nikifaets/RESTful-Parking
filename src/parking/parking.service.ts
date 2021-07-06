import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from '../vehicle/schemas/vehicle.schema';
import { CreateVehicleDTO } from '../vehicle/dto/create-vehicle.dto';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParkingService {

    constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>, private configService: ConfigService) {}

    async countFreeSpots(): Promise<number> {

        const categories = this.configService.get('categories');

        const spotsPerCategory = await Promise.all(categories.map(async x => {
            const vehicleNum = await this.vehicleModel.countDocuments({category: x}).exec();
            console.log(`vehicle num ${vehicleNum}`);
            return vehicleNum * this.configService.get(`${x}.requiredSpace`)}));
        
        console.log(`spots ${spotsPerCategory}`);
        const res = spotsPerCategory.reduce((a: number, b: number) => a + b, 0);
        return Number(res);


    }

    async create(createVehicleDTO: CreateVehicleDTO): Promise<Vehicle> {
        
        const createdVehicle = new this.vehicleModel(createVehicleDTO);
        createdVehicle.enterDate = Date();
        console.log(`New createdVehicle - ${createdVehicle}.`);
        return createdVehicle.save(); 
    }

    calculateDayComplement(hour: number, nightTariff: number, dayTariff: number): number {

        const dayStart = this.configService.get('dayStart');
        const nightStart = this.configService.get('nightStart');

        let res = 0;
        if(hour < 24 && hour >= nightStart) {
            res += nightTariff * (24 - hour) + nightTariff * dayStart;
        }

        if(hour < dayStart) {
            res += nightTariff * (dayStart - hour);
        }

        if(hour > dayStart && hour < nightStart) {
            res += dayTariff * (nightStart - hour) + nightTariff * (24 + dayStart - nightStart);
        }

        return res;
    }

    async calculatePrice(id): Promise<number> {

        console.log(`print service ${this.configService.get('A.nightTariff')}`);


        const millisecondsInDay = this.configService.get('millisecondsInDay');

        const vehicle = await this.vehicleModel.findOne({_id: id}).exec();

        const enterDate = new Date(vehicle.enterDate);
        const currentDate = new Date();
        const dayTariff = this.configService.get(`${vehicle.category}.dayTariff`);
        const nightTariff = this.configService.get(`${vehicle.category}.nightTariff`);
        const dayStart = this.configService.get('dayStart');
        const nightStart = this.configService.get('nightStart');
        const nightLen = 24 - nightStart + dayStart;
        const dayLen = 24 - nightLen;

        const millisecondsDiff = Date.parse(currentDate.toUTCString()) - Date.parse(enterDate.toUTCString());
        const fullDays = Math.floor(millisecondsDiff / millisecondsInDay) + 1;
        const pricePerFullDay = nightTariff * nightLen + dayTariff * dayLen;

        const enterHour = enterDate.getHours();
        const exitHour = currentDate.getHours();

        const firstDayComplement = this.calculateDayComplement(enterHour, nightTariff, dayTariff); // Holds the price from the hour of entering to 8am.
        const lastDayComplement = this.calculateDayComplement(exitHour, nightTariff, dayTariff); // Holds the price from the hour of exiting to 8am.

        console.log(` milliseconds diff ${millisecondsDiff}, enter date: ${enterDate}, enter hour: ${enterHour}, exit hour: ${exitHour} `);
        console.log(` full days ${fullDays}, pricePerfullDay ${pricePerFullDay}, first day complement ${firstDayComplement}, last day comlement ${lastDayComplement}`);
        return fullDays * pricePerFullDay - pricePerFullDay + firstDayComplement - lastDayComplement;

    } 

    async delete(id) {

        await this.vehicleModel.deleteOne({_id: id});
        return {
            message: `Successfuly deleted vehicle with id ${id}`
        };
        
    }
}
