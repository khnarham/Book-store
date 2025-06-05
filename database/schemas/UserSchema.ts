import mongoose, { Schema, Document } from "mongoose";
import { RoleEnum, StatusEnum } from "@/app/types/enums";

export interface IUser extends Document {
  fullName: string;
  email: string;
  universityId: number;
  password: string;
  universityCard: string;
  status: StatusEnum;
  role: RoleEnum;
  lastActivityDate: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  universityId: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  universityCard: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.PENDING,
  },
  role: {
    type: String,
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
  },
  lastActivityDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
