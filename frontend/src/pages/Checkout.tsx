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
  const navigate = useNavigate()
  if (!cart || cart.length === 0) {
    return <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500 text-lg">Your cart is empty</p>
    </div>
  }

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

  const payWithRazorpay = async () => {
    try {
      setLoadingRazorpay(true)
      const order = await createOrder("razorpay")
      if (!order) return;
      const { orderId, amount } = order;
      const { data } = await axios.post(`${utilsService}/api/payment/create`, { orderId, }, {})
      const { razorpayOrderId, key } = data;
      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: amount * 100, // Amount is in currency subunits. 
        currency: "INR",
        name: "Tomato", //your business name
        description: "Food Delivery",
        order_id: razorpayOrderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: any) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          try {
            await axios.post(`${utilsService}/api/payment/verify`, {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              orderId
            })
            toast.success("Payment successful")
            navigate("/paymentsuccess/" + razorpay_order_id)
          }
          catch (error) {
            console.log(error)
            toast.error("Payment verification failed")
          }
        },
        theme: {
          color: "#3399cc"
        }
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error)
      toast.error("Failed to initiate payment Please Refresh Page")
    } finally {
      setLoadingRazorpay(false)
    }
  }
  const paywithStripe = async () => {
    try {
      setLoadingStripe(true)
      const order = await createOrder("stripe")
      if (!order) return;
      console.log("Stripe xheckout session created", order)
    }
    catch (error) {
      console.log(error)
      toast.error("Failed to initiate payment Please Refresh Page")
    } finally {
      setLoadingStripe(false)
    }
  }
  return (
    <div className='mx-auto max-w-4xl px-4 py-6 space-y-6' >
      <h1 className='text-2xl font-bold ' >Checkout</h1>
      <div className="rounded-xl bgwhit  p-4 shadow-sm">
        <h2 className="text-lg font-semibold">{restaurant.name}</h2>
        <p className="text-gray-600">{restaurant.autoLocation.formattedAddress}</p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm space-y-3 ">
        < h3 className="text-lg font-semibold">Delivery Address</h3>
        {loadingAddress ? <p>Loading addresses...</p> : addresses.length === 0 ? <p>No addresses found. Please add an address in your profile.</p> : (
          addresses.map((add) => (
            <label key={add._id} className="flex items-center space-x-2">
              <input
                type="radio"
                name="address"
                value={add._id}
                checked={selectedAddressId === add._id}
                onChange={() => setSelectedAddressId(add._id)}
              />
              <span>{add.formattedAddress}</span>
            </label>
          ))
        )}
      </div>
    </div>
      )
}


      export default Checkout