import React, { useEffect, useState } from 'react'
import { useAppData } from '../context/AppContext';
import axios from 'axios';
import { restaurantService, utilsService } from '../main';
import { useNavigate } from 'react-router-dom';
import type { IRestaurant } from '../types';
import toast from 'react-hot-toast';

interface Address {
  _id: string;
  formattedAddress: string;
  mobile: number;
}

const Checkout = () => {
  const { cart, subTotal, quantity } = useAppData()
  const [addresses, setaddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loadingAddress, setLoadingAddress] = useState(true)
  const [loadingRazorpay, setLoadingRazorpay] = useState(false)
  const [loadingStripe, setLoadingStripe] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  useEffect(() => {
    const fetchAddress = async () => {
      if (!cart || cart.length === 0) {
        setLoadingAddress(false)
        return;
      }
      try {
        const { data } = await axios.get(`${restaurantService}/api/address/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setaddresses(data || [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAddress(false)
      }
    }
    fetchAddress()
  }, [cart])
  if (!cart || cart.length === 0) {
    return <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500 text-lg">Your cart is empty</p>
    </div>
  }

  const navigate = useNavigate()
  const restaurant = cart[0].restaurantId as IRestaurant
  const deliveryFee = subTotal < 250 ? 49 : 0
  const platformFee = 7
  const grandTotal = subTotal + deliveryFee + platformFee
  const createOrder = async (paymentMethod: "razorpay" | "stripe") => {
    if (!selectedAddressId) return null;
    setCreatingOrder(true)
    try {
      const { data } = await axios.post(`${restaurantService}/api/order/new`, {
        paymentMethod, addressId: selectedAddressId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return data;
    } catch (error) {
      console.log(error)
      toast.error("Failed to create order")
    } finally {
      setCreatingOrder(false)
    }
  }

const payWithRazorpay = async()=>{
  try {
    setLoadingRazorpay(true)
    const order = await createOrder("razorpay")
    if(!order) return;
    const {orderId, amount} = order;
    const {data} = await axios.post(`${utilsService}/api/payment/create`, {orderId,}, {})
  } catch (error) {
    console.log(error)
  } finally {
    setLoadingRazorpay(false)
  }
}
  return (
    <div>Checkout</div>
  )
}

export default Checkout