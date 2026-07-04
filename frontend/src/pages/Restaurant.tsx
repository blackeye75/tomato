import React, { useEffect, useState } from 'react'
import type { IRestaurant } from '../types'
import axios from 'axios'
import { restaurantService } from '../main'
import AddRestaurant from '../components/AddRestaurant'
import RestaurantProfile from '../components/restaurantProifle'

type sellerTab = "menu" | "add-item" | "sales"

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<sellerTab>("menu")
  const fetchMyRestaurant = async () => {
    try {
      const { data } = await axios.get(`${restaurantService}/api/restaurant/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setRestaurant(data.restaurant || null)
      if (data.token) {
        localStorage.setItem("token", data.token)
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchMyRestaurant()
  }, [])
  if (loading) {
    return <div className='flex items-center justify-center min-h-screen  text-gray-500' >Loading Your Restaurant...</div>
  }

  if (!restaurant) return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-6 space-y-6' >
      <RestaurantProfile restaurant={restaurant} isSeller={true} onUpdate={setRestaurant} />

      <div className='rounded-xl bg-white shadow-sm ' >
        <div className="flex border-b">
          {
            [{ key: "menu", label: "Menu" }, { key: "add-item", label: "Add Item" }, { key: "sales", label: "Sales" }].map((item) => (
              <button key={item.key} onClick={() => setTab(item.key as sellerTab)} className={`px-4 flex-1 py-2 transition duration-110 text-sm font-medium ${tab === item.key ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`} >
                {item.label}
              </button>
            ))
          }
        </div>
        <div className="p-5">
          {
            tab === "menu" && <div>Menu</div>
          }
          {
            tab === "add-item" && <div>Add Item</div>
          }
          {
            tab === "sales" && <div>Sales</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Restaurant