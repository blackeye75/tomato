import React from 'react'
import { useAppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BiHome, BiPackage } from 'react-icons/bi'

const Account = () => {

  const { user, setUser, setIsAuth } = useAppData()
  // console.log(user.image)
  const firstLetter = user?.name?.charAt(0).toUpperCase()
  const navigate = useNavigate()
  const [imageError, setImageError] = React.useState(false)
  
  const logouthandler = () => {
    localStorage.removeItem("token")
    navigate("/login")
    setUser(null)
    setIsAuth(false)
    toast.success("Logged out successfully")
  }
  
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-6' >
      <div className="mx-auto max-w-md rounded-lg bg-white shadow-sm">
        <div className='flex items-center gap-4 border-b p-5' >
          <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden bg-blue-100">
            {user?.image && !imageError ? (
              <img 
                src={user.image} 
                className='w-full h-full object-cover' 
                alt="user profile"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className='text-xl font-semibold text-blue-600'>{firstLetter}</span>
            )}
          </div>
          <div>
            <h2 className='text-lg font-semibold' >{user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : ''}</h2>
            <p className='text-gray-500 text-sm -mt-1' >{user?.email}</p>
          </div>
        </div>
        <div className='divide-y' >
          <div className="flex  cursor-pointer items-center gap-4 p-5 hover:bg-gray-50" onClick={() => navigate('/orders')}>
            <BiPackage className='w-5' />
            <span className='text-gray-700' >Orders</span>
          </div>
          <div className="flex  cursor-pointer items-center gap-4 p-5 hover:bg-gray-50" onClick={() => navigate('/address')}>
            <BiHome className='w-5' />
            <span className='text-gray-700' >Address</span>
          </div>
          <div className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-50" onClick={logouthandler}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span className='text-gray-700' >Logout</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account