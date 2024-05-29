import { prop, getModelForClass } from '@typegoose/typegoose';
import mongoose, { Schema, Types } from 'mongoose';

class User {
	@prop({ required: true })
	public email?: string;

	@prop({ required: true, select: false })
	public passwordHash?: string;

	@prop()
	public profilePicture?: string;

	@prop({ required: true, select: false, default: [] })
	public experiencePoints?: {points: number, timestamp: Date}[];

	@prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Community' })
	public currentCommunity?: Types.ObjectId | null;
}

export const UserModel = getModelForClass(User);