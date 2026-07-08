import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { restaurantService } from "../main";
import { BiUpload } from "react-icons/bi";

const AddMenuItem = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const resetForm = () => {
    setPrice("");
    setName("");
    setDescription("");
    setImage(null);
  };
  const handleSubmit = async () => {
    if (!name || !price || !image) {
      toast.error("Name Price Image of Menu Item are required");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("file", image);
    try {
      setLoading(true);
      await axios.post(`${restaurantService}/api/item/new`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Item added Successfully");
      resetForm();
      onItemAdded();
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to add item", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md space-y-4 m-auto">
      <h1 className="text-lg font-semibold ">Add Menu Item</h1>
      <input
        placeholder="Item Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />
      <textarea
        placeholder="Item Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 text-sm outline-none "
      />
      <input
        placeholder="Price Item"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full rounded-lg border px-4 py-2 text-sm outline-none "
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
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full rounded-lg text-white text-sm py-3 font-semibold transition bg-red-500 "
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </div>
  );
};

export default AddMenuItem;
