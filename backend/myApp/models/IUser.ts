import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IPosition {
    x: number,
    y: number
}

export interface IUser {
    name: string,
    firstName: string,
    pictureURL: string,
    nosePosition?: IPosition,
    lastUpdateDate: Date,
    birthDate: Date,
}

const PositionSchema = new Schema<IPosition>({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
})

export const UserSchema = new Schema<IUser>({
    name: { type : String, required: true },
    firstName: { type : String, required: true },
    pictureURL: { type : String, required: true },
    nosePosition: { type: PositionSchema, required: false},
    lastUpdateDate: { type : Date, required: true, default: Date.now },
    birthDate: { type : Date, required: true },
})