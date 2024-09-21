import mongoose from 'mongoose';
import { MONGO_CONNECTION_STRING } from './config.js';
import { UserSchema } from '../models/IUser.js';

export function mongooseInit() {
    mongoose.connect(MONGO_CONNECTION_STRING);
    const userMongoModel = mongoose.model('User', UserSchema, 'users');
    return userMongoModel;
}