import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from '../vehicle/schemas/vehicle.schema';
import { CreateVehicleDTO } from '../vehicle/dto/create-vehicle.dto';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ParkingService {

    constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>, private configService: ConfigService) {}

    async findOne(id): Promise<Vehicle> {

        const vehicle = await this.vehicleModel.findOne({_id: id}).exec();

        if(!vehicle) {
            throw new HttpException('Invalid vehicle ID.', HttpStatus.BAD_REQUEST);
        }

        return vehicle
    }
    async countFreeSpots(): Promise<number> {

        const categories = this.configService.get('categories');

        const spotsPerCategory = await Promise.all(categories.map(async x => {
            const vehicleNum = await this.vehicleModel.countDocuments({category: x}).exec();
            return vehicleNum * this.configService.get(`${x}.requiredSpace`)}));
        
        const res = spotsPerCategory.reduce((a: number, b: number) => a + b, 0);
        return this.configService.get('parkingCapacity') - Number(res);

    }

    async create(createVehicleDTO: CreateVehicleDTO): Promise<Object> {
        
        const freeSpots = await this.countFreeSpots();

        if(freeSpots + this.configService.get(`${createVehicleDTO.category}.requiredSpace`) > this.configService.get(`parkingCapacity`)) {
            throw new HttpException('Parking capacity is reached.', HttpStatus.OK);
        }

        const createdVehicle = new this.vehicleModel(createVehicleDTO);
        createdVehicle.enterDate = Date();
        return {id: (await createdVehicle.save())._id}; 
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

    async calculatePrice(id): Promise<Object> {

        const millisecondsInDay = this.configService.get('millisecondsInDay');
 
        const vehicle = await this.findOne(id);

        const enterDate = new Date(vehicle.enterDate);
        const currentDate = new Date();
        const dayTariff = this.configService.get(`${vehicle.category}.dayTariff`);
        const nightTariff = this.configService.get(`${vehicle.category}.nightTariff`);
        const dayStart = this.configService.get('dayStart');
        const nightStart = this.configService.get('nightStart');
        const nightLen = 24 - nightStart + dayStart;
        const dayLen = 24 - nightLen;

        const millisecondsDiff = Date.parse(currentDate.toUTCString()) - Date.parse(enterDate.toUTCString());
        const pricePerFullDay = nightTariff * nightLen + dayTariff * dayLen;

        const enterHour = enterDate.getHours();
        const exitHour = currentDate.getHours();

        const firstDayComplement = this.calculateDayComplement(enterHour, nightTariff, dayTariff); // Holds the price from the hour of entering to 8am.
        const lastDayComplement = this.calculateDayComplement(exitHour, nightTariff, dayTariff); // Holds the price from the hour of exiting to 8am.
        const fullDays = Math.floor(millisecondsDiff / millisecondsInDay) + (firstDayComplement >= lastDayComplement ? 1 : 2);

        const discount = 1 - this.configService.get<number>(`${vehicle.premium}`);

        return {price: discount * (fullDays * pricePerFullDay - pricePerFullDay + firstDayComplement - lastDayComplement)};

    } 

    async delete(id) {
        
        const vehicle = await this.findOne(id);

        const price = await this.calculatePrice(id);
        this.vehicleModel.deleteOne({_id: id});
        return {
            message: `Successfully deleted vehicle with id ${id}.`,
            price: (await price)
        };
        
    }
}
