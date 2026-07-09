import React, { useState } from "react";
import type { IMenuItem } from "../types";
import { BsCart, BsCartPlus, BsEye } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BiLoader, BiTrash } from "react-icons/bi";
import toast, { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import { restaurantService } from "../main";

interface MenuItemProps {
  items: IMenuItem[];
  onItemDelete: () => void;
  isSeller: boolean;
}

const MenuItems = ({ items, onItemDelete, isSeller }: MenuItemProps) => {
  const [loadingItemId, setLoadingItemId] = useState(null);
  const handleDelete = async (itemId: string) => {
    const confirm = window.confirm("Are You Sure? You Want to delete this item");
    if (!confirm) {
      return;
    }
    try {
      await axios.delete(`${restaurantService}/api/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Item Deleted");
      onItemDelete();
    } catch (error: any) {
      console.log(error.message);
      toast.error("Failed to Delete Item");
    }
  };

  const toggleAvailabelity = async (itemId: string) => {
    try {
      const { data } = await axios.put(
        `${restaurantService}/api/item/status/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(data.message);
      onItemDelete();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update");
    }
  };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const isLoading = loadingItemId === item._id;
        return (
          <div
            key={item._id}
            className={`relative flex gap-4 rounded-lg bg-white p-4 shadow-sm transition ${!item.isAvailable ? "opacity-70" : ""} `}
          >
            <div className="relative shrink-0 ">
              <img
                src={item.image}
                className={`h-20 w-20 rounded-md object-cover ${!item.isAvailable ? "grayscale brightness-75" : ""}`}
                alt=""
              />
              {!item.isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center rounded bg-black/60 text-xs font-semibold text-white">
                  Not Available
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="">
                <h3 className="font-semibold ">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between ">
                <p className="font-medium ">₹ {item.price}</p>
                {isSeller && (
                  <div className="flex gap-2  ">
                    <button
                      onClick={() => {
                        toggleAvailabelity(item._id);
                      }}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      {item.isAvailable ? <BsEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <BiTrash size={18} />
                    </button>
                  </div>
                )}
                {!isSeller && (
                  <button
                    disabled={!item.isAvailable || isLoading}
                    onClick={() => { }}
                    className={`flex items-center justify-center rounded-lg p-2 ${!item.isAvailable || isLoading ? "cursor-not-allowed text-gray-400" : "hover:bg-red-500 hover:text-white text-red-500 "}`}
                  >
                    {isLoading ? (
                      <BiLoader size={18} className="animate-spin" />
                    ) : (
                      <BsCartPlus size={18} className=" " />  
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;
