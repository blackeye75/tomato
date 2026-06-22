import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import { type LocationData, type AppContextType, type User } from "../types";

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
      // console.log(data.data.user)
      setUser(data.user)
      setIsAuth(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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
      }
    })
  }, [])
  return <AppContext.Provider value={{ location, loadingLocation, city, user, loading, isAuth, setUser, setIsAuth, setLoading }}>{children}</AppContext.Provider>
}

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppData must be used within a AppProvider")
  }
  return context;
} 