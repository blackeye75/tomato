import React, { useState } from 'react'
import type { IRestaurant } from '../types'
import { restaurantService } from '../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiEdit, BiMap, BiMapPin, BiSave } from 'react-icons/bi';
interface props {
  restaurant: IRestaurant;
  isSeller: boolean;
  onUpdate: (restaurant: IRestaurant) => void;
}
const RestaurantProfile = ({ restaurant, isSeller, onUpdate }: props) => {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(restaurant.name)
  const [description, setDescription] = useState(restaurant.description)
  const [isOpen, setIsOpen] = useState(restaurant.isOpen)
  const [loading, setLoading] = useState(false)
  // console.log(restaurant)
  const toggleOpenStatus = async () => {
    setLoading(true)
    try {
      const { data } = await axios.put(`${restaurantService}/api/restaurant/status`, { status: !isOpen }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success(data.message)
      setIsOpen(data.restaurant.isOpen)
    } catch (error: any) {
      console.error(error)
      toast.error("Failed to update status", error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const saveChanges = async () => {
    try {
      setLoading(true)
      const { data } = await axios.put(`${restaurantService}/api/restaurant/update`, { name, description }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success(data.message)
      onUpdate(data.restaurant)
      setEditMode(false)
    } catch (error) {
      console.log(error)
      toast.error("Failed to update restaurant")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='mx-auto max-w-xl rounded-xl bg-white shadow-sm overflow-hidden ' >
      {
        restaurant.image && <img src={restaurant.image} alt={restaurant.name} className='w-full h-48 object-cover' />
      }
      <div className="p-5 space-y-1">
        {
          isSeller && (<div className='flex items-center justify-between' >
            <div>
              {
                editMode ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full rounded-lg border px-2 py-1 text-lg font-semibold outline-none' /> : <h1 className='text-xl font-semibold' >{restaurant.name}</h1>
              }
              <div className='mt-1 flex items-center gap-2 text-sm text-gray-500' >
                <BiMapPin className='h-4 w-4 text-red-500' />
                {restaurant.autoLocation.formattedAddress || "Location Unavailable"}
              </div>
            </div>
            <button onClick={() => setEditMode(!editMode)} className='text-gray-500 hover:text-black'>
              <BiEdit size={18} />
            </button>
          </div>)
        }
        {
          editMode ? <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full rounded-lg border px-2 py-1 text-sm outline-none' /> : <p className='text-sm text-gray-600' >{restaurant.description}</p>
        }
        <div className="flex items-center justify-between pt-3 border-t">
          <span className={`text-sm font-medium ${isOpen ? 'text-green-500' : 'text-red-500'}`} >{isOpen ? "Open" : "Closed"}</span>
          <div className="flex gap-3 ">
            {
              editMode && <button onClick={saveChanges} disabled={loading} className='px-3 py-1 gap-1 flex items-center text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600' >
                <BiSave size={16} />
                {loading ? "Saving..." : "Save"}</button>
            }
            {
              isSeller && <button onClick={toggleOpenStatus} disabled={loading} className={`px-3 py-1 text-sm tracking-tight rounded-lg text-white ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`} > {loading ? "Updating..." : isOpen ? "Close Restaurant" : "Open Restaurant"}</button>
            }
          </div>
        </div>
        <p className='text-xs text-gray-400' >Created At: {new Date(restaurant.createdAt).toLocaleDateString()}</p>
        <p className='text-xs text-gray-400' >Phone no: {restaurant.phone}</p>
      </div>
    </div>
  )
}

export default RestaurantProfile