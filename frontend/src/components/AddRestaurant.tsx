import React, { useState } from "react";
import { useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { restaurantService } from "../main";
import { BiMap, BiUpload } from "react-icons/bi";

interface props {
 fetchMyRestaurant: () => Promise<void>;
}

const AddRestaurant = ({ fetchMyRestaurant }: props) => {
 const [name, setName] = useState("");
 const [description, setdescription] = useState("");
 const [phone, setPhone] = useState("");
 const [image, setImage] = useState<File | null>(null);
 const [submiting, setSubmiting] = useState(false);

 const { loadingLocation, location } = useAppData();

 const handleSubmit = async () => {
  if (!name || !image || !location) {
   return alert("Please fill all details");
  }
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("latitude", String(location.latitude));
  formData.append("longitude", String(location.longitude));
  formData.append("formattedAddress", location.formatedAddress);
  formData.append("phone", phone);
  formData.append("file", image);

  try {
   setSubmiting(true);
   await axios.post(`${restaurantService}/api/restaurant/new`, formData, {
    headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
   });
   toast.success("Restaurant Created Successfully");
   fetchMyRestaurant();
  } catch (error: any) {
   toast.error(error.response?.data?.message || "Something went wrong");
   console.log(error);
  } finally {
   setSubmiting(false);
  }
 };
 return (
  <div className="min-h-screen bg-gray-50 px-4 py-6">
   <div className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm space-y-5 ">
    <h1 className="text-xl font-semibold">Add Your Restaurant</h1>
    <input
     type="text"
     placeholder="Restaurant Name"
     value={name}
     onChange={(e) => setName(e.target.value)}
     className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
    />
    <input
     type="number"
     placeholder="Phone Number"
     value={phone}
     onChange={(e) => setPhone(e.target.value)}
     className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
    />
    <textarea
     placeholder="Description"
     value={description}
     onChange={(e) => setdescription(e.target.value)}
     className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
    />
    <label
     htmlFor="image"
     className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 text-sm outline-none text-gray-600 hover:bg-gray-50"
    >
     <BiUpload className="inline-block mr-2 h-5 w-5" />
     {image ? image.name : "Upload Image"}
     <input
      type="file"
      id="image"
      accept="image/*"
      onChange={(e) => setImage(e.target.files?.[0] || null)}
      className="hidden"
     />
    </label>
    <div className="flex items-center gap-3 rounded-lg border p-3">
     <div className="flex h-[10%] w-[10%] items-center justify-center rounded-full bg-gray-100">
      <BiMap className="mt-0.5 h-5 w-5 text-gray-500" />
     </div>
     <div className="text-xs w-[90%] h-[90%]">
      {loadingLocation
       ? "Fetching Location..."
       : location?.formatedAddress || "Please Turn on Location"}
     </div>
    </div>
    <button
     className=" text-white py-2 px-4 rounded-md bg-[#ca1b1b] transition-all duration-300 ease-in-out   hover:bg-[#2563eb]"
     onClick={handleSubmit}
     disabled={submiting}
    >
     {submiting ? "Submitting..." : "Add Restaurant"}
    </button>
   </div>
  </div>
 );
};

export default AddRestaurant;
