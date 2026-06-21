import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import type { AppContextType, User } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [city, setcity] = useState("Featching location...")
  // console.log(user)
  async function fetchUser() {
    const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }
    try {
      // const token = localStorage.getItem("token")
      const {data} = await axios.get(`${authService}/api/auth/me`, {
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
  return <AppContext.Provider value={{ user, loading, isAuth, setUser, setIsAuth, setLoading }}>{children}</AppContext.Provider>
}

export const useAppData = ():AppContextType =>{
  const context = useContext(AppContext)
  if(!context){
    throw new Error("useAppData must be used within a AppProvider")
  }
  return context;
} 