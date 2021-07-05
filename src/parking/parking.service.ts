import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from '../vehicle/schemas/vehicle.schema';
import { CreateVehicleDTO } from '../vehicle/dto/create-vehicle.dto';
import { Model } from 'mongoose';

@Injectable()
export class ParkingService {
    constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>) {}

    async countFreeSpots(): Promise<number> {

        const vehiclesA = await this.vehicleModel.find({category: 'A'}).count().exec();
        const vehiclesB = await this.vehicleModel.find({category: 'B'}).count().exec();
        const vehiclesC = await this.vehicleModel.find({category: 'C'}).count().exec();
        return vehiclesA + 2 * vehiclesB + 3 * vehiclesC;
    }

    async create(createVehicleDTO: CreateVehicleDTO): Promise<Vehicle> {
        
        const createdVehicle = new this.vehicleModel(createVehicleDTO);
        createdVehicle.enterDate = Date();
        console.log(`New createdVehicle - ${createdVehicle}.`);
        return createdVehicle.save(); 
    }

    calculateDayComplement(hour: number, nightTariff: number, dayTariff: number): number {

        const dayStart = 8;
        const nightStart = 18;

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

        const dayTariff = 3;
        const nightTariff = 2;
        const dayStart = 8;
        const nightStart = 18;
        const nightLen = 24 - nightStart + dayStart;
        const dayLen = 24 - nightLen;

        const millisecondsInDay = 1000 * 3600 * 24;

        const vehicle = await this.vehicleModel.findOne({_id: id}).exec();
        const enterDate = new Date(vehicle.enterDate);
        const currentDate = new Date();

        const millisecondsDiff = Date.parse(currentDate.toUTCString()) - Date.parse(enterDate.toUTCString());
        console.log(`current date millis: ${currentDate.getUTCMilliseconds()}, enter date millis: ${enterDate.getUTCMilliseconds()}`);
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
