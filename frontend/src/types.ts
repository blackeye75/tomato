import type React from "react";

export interface User {
 _id: string;
 name: string;
 email: string;
 image: string;
 role: string;
}

export interface LocationData {
 latitude: number;
 longitude: number;
 formatedAddress: string;
}

export interface AppContextType {
 user: User | null;
 loading: boolean;
 isAuth: boolean;
 setUser: React.Dispatch<React.SetStateAction<User | null>>;
 setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
 setLoading: React.Dispatch<React.SetStateAction<boolean>>;
 loadingLocation: boolean;
 location: LocationData | null;
 city: string;
}

export interface IRestaurant {
 _id: string;
 name: string;
 description: string;
 image: string;
 ownerId: string;
 phone: number;
 isVerified: boolean;
 autoLocation: {
  type: "Point";
  coordinates: [number, number];
  formattedAddress: string;
 };
 isOpen: boolean;
 createdAt: Date;
}

export interface IMenuItem  {
  _id:string
 restaurantId: string;
 name: string;
 description: string;
 price: number;
 image?: string;
 isAvailable: boolean;
 createdAt: Date;
 updatedAt: Date;
}
