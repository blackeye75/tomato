import React, { useState } from 'react'
import { useAppData } from '../context/AppContext'

const AddRestaurant = () => {
  const [name, setName] = useState("")
  const [description, setdescription] = useState("")
  const [phone, setPhone] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [submiting, setSubmiting] = useState(false)

  const { loadingLocation, location } = useAppData()

  const handleSubmit = async () => {
    if (!name || !image || !location) {
      return alert("Please fill all details")
    }
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    
    formData.append("phone", phone)
    formData.append("file", image)
  }
  return (
    <div>AddRestaurant</div>
  )
}

export default AddRestaurant