import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../main'
import axios from 'axios'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const responseGoogle = async (authResult: any) => {
    setLoading(true)
    try {
      const result = await axios.post(`${authService}/api/auth/login`, { code: authResult["code"] })
      
    } catch (error) {

    }
  }
  return (
    <div>Login</div>
  )
}

export default Login