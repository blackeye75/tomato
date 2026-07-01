import { Schema, Types, model } from "mongoose";

export interface IUser {
 email: string;
 name: string;
 image: string;
 role: string;
}

export interface IUserPayload extends IUser {
 _id: Types.ObjectId | string;
}

const schema: Schema<IUser> = new Schema(
 {
  name: {
   type: String,
   required: true,
  },
  email: {
   type: String,
   required: true,
   unique: true,
  },
  image: {
   type: String,
   required: true,
  },
  role: {
   type: String,
   default: null,
  },
 },
 {
  timestamps: true,
 },
);

const User = model<IUser>("User", schema);
export default User;
