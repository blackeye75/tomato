import mongoose, { Schema, Document } from "mongoose";

export interface IResturant extends Document {
 name: string;
 description: string;
 image: string;
 ownerId: string;
 phone:number;
 isVerifed: boolean;
 autoLocation: {
  type: "Point";
  coordinates: [number, number];
  formatedAddress: string;
 };
 isOpen: boolean;
 createdAt: Date;
}

const schema = new Schema<IResturant>({
  // name:{
  //   type:String,
  //   required:true,
  //   trim:true
  // },
  description:String,
  image:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true
  },
  ownerId:{
    type:String,
    required:true
  },
  isVerifed:{
    type:Boolean,
    required:true
  },
  autoLocation:{
    type:{
      type:String,
      enum:["Point"],
      required:true
    }
  }
})
