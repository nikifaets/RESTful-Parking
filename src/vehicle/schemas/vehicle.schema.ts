import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {

    @Prop()
    category: string;

    @Prop()
    premium: string;

    @Prop()
    enterDate: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);