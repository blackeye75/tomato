import React, { useState } from 'react'
import type { IRestaurant } from '../types'
import { restaurantService } from '../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiEdit, BiMap, BiMapPin } from 'react-icons/bi';
interface props {
  restaurant: IRestaurant;
  isSeller: boolean;
  onUpdate: (restaurant: IRestaurant) => void;
}
const restaurantProifle = ({ restaurant, isSeller, onUpdate }: props) => {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(restaurant.name)
  const [description, setDescription] = useState(restaurant.description)
  const [isOpen, setIsOpen] = useState(restaurant.isOpen)
  const [loading, setLoading] = useState(false)
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
      onUpdate(data.restaurant)
      toast.success(data.message)
    } catch (error) {
      console.log(error)
      toast.error("Failed to update restaurant")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='mx-auto max-w-7xl rounded-xl bg-white shadow-sm overflow-hidden ' >
      {
        restaurant.image && <img src={restaurant.image} alt={restaurant.name} className='w-full h-48 object-cover' />
      }
      <div className="p-5 space-y-4">
        {
          isSeller && (<div className='flex items-center justify-between' >
            <div>
              {
                editMode ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full rounded-lg border px-2 py-1 text-lg font-semibold outline-none' /> : <h1 className='text-xl font-semibold' >{restaurant.name}</h1>
              }
              <div className='mt-1 flex items-center gap-2 text-sm text-gray-500' >
                <BiMapPin className='h-4 w-4 text-red-500' />
                {restaurant.autoLocation.formatedAddress || "Location Unavailable"}
              </div>
            </div>
            <button onClick={() => setEditMode(!editMode)} className='text-gray-500 hover:text-black'>
              <BiEdit size={18} />
            </button>
            {/* <h1 className='text-2xl font-semibold' >{restaurant.name}</h1>
            <button onClick={toggleOpenStatus} disabled={loading} className={`px-4 py-2 rounded-lg text-white ${isOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`} > {loading ? "Updating..." : isOpen ? "Open" : "Closed"}</button> */}
          </div>)
        }
        {
          editMode ? <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full rounded-lg border px-2 py-1 text-sm outline-none' /> : <p className='text-sm text-gray-600' >{restaurant.description}</p>
        }
        <div className="flex items-center justify-between pt-3 border-t">
          <span className='' >{isOpen ? "Open" : "Closed"}</span>
        </div>
      </div>
    </div>
  )
}

export default restaurantProifle