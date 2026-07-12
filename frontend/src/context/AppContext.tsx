import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, restaurantService } from "../main";
import type { LocationData, AppContextType, User, ICart } from "../types";
import { Toaster } from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [city, setcity] = useState("Featching location...")
  // console.log(user)
  async function fetchUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);       // good one
      return;
    }
    try {
      // const token = localStorage.getItem("token")
      const { data } = await axios.get(`${authService}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log(data.user)
      setUser(data.user)
      setIsAuth(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const [cart, setCart] = useState<ICart[]>([])
  const [subTotal, setSubTotal] = useState(0)
  const [quantity, setQuantity] = useState(0)

  async function fetchCart() {
    // console.log("fetch cart")
    if (!user || user.role !== "customer") return;
    try {
      const { data } = await axios.get(`${restaurantService}/api/cart/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setCart(data.cart || [])
      setSubTotal(data.subTotal || 0)
      setQuantity(data.cartLength)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      return alert("Please Turn on Location")
    }
    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        const data = await res.json()
        setLocation({
          latitude,
          longitude,
          formatedAddress: data.display_name || "current location"
        })
        setcity(data.address.city || data.address.town || data.address.village || "Your Location")
      } catch (error) {
        setLocation({
          longitude,
          latitude,
          formatedAddress: "Current Location "
        })
        setcity("Failed to load")
      } finally {
        setLoadingLocation(false)
      }
    })
  }, [])

  useEffect(() => {
    // console.log("USe effect triggred with ", user?.role)
    if (user && user.role === "customer") {
      fetchCart()
    }
  }, [user])


  return <AppContext.Provider value={{ location, loadingLocation, city, user, loading, isAuth, setUser, setIsAuth, setLoading, cart, fetchCart, subTotal, quantity }}>{children}<Toaster /></AppContext.Provider>
}

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppData must be used within a AppProvider")
  }
  return context;
} 