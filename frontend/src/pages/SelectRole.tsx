import React, { useState } from 'react'
import { useAppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const SelectRole = () => {
  type Role = "customer" | "seller" | "rider" | null
  const [role, setRole] = useState<Role>(null)
  const { setUser } = useAppData()
  const navigate = useNavigate()
  const roles: Role[] = ["customer", 'rider', "seller"]
  
  return (
    <div>SelectRole</div>
  )
}

export default SelectRole