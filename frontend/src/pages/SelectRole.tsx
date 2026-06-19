import React, { useState } from 'react'
import { useAppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authService } from '../main'

const SelectRole = () => {
  type Role = "customer" | "seller" | "rider" | null
  const [role, setRole] = useState<Role>(null)
  const { setUser } = useAppData()
  const navigate = useNavigate()
  const roles: Role[] = ["customer", 'rider', "seller"]
  const addRole = async () => {
    try {
      const { data } = await axios.put(`${authService}/api/auth/add/role`, { role }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      localStorage.setItem("token", data.token)
      setUser(data.user)
      navigate("/", { replace: true })
    } catch (error) {
      alert("Error while adding role")
      console.log(error)
    }
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4' >
      <div className='w-full max-w-sm space-y-6' >
        <h1 className='text-2xl font-bold text-center' >choose Your Role</h1>
        <div className='space-y-6' >
          {roles.map((r) => (
            <div key={r} className={`border p-3 rounded-md cursor-pointer ${role === r ? "transition- bg-red-500 text-white" : "bg-white text-gray-800"}`} onClick={() => setRole(r)} >
              <h2 className='text-lg font-light' >Countine as {r}</h2>
            </div>
          ))}
          <button disabled={!role} onClick={addRole} className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50' >
            Continue as {role}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectRole