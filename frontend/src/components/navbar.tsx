import React, { useEffect, useState } from 'react'
import { useAppData } from '../context/AppContext'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { CgShoppingCart } from 'react-icons/cg'
import { BiMap, BiSearch } from 'react-icons/bi'

const Navbar = () => {
  const { isAuth, user } = useAppData()
  const currLocation = useLocation()
  const isHome = currLocation.pathname === "/"
  const [searchParam, setSearchParam] = useSearchParams()
  const [search, setsearch] = useState(searchParam.get("search") || "")
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setSearchParam({ search })
      } else {
        setSearchParam({})
      }
    }, 400);
    return () => {
      clearTimeout(timer)
    }
  }, [search])
  return (
    <div className='w-full bg-white shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3' >
        <Link to="/" className='text-2xl font-bold text-[#E23774] cursor-pointer' >Tomato</Link>
        <div className='flex items-center gap-4' >
          <Link to="/cart" className='relative' >
            <CgShoppingCart className='h-6 w-6 text-[#E23774]' />
            <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E23774] text-xs text-white' >0</span>
          </Link>
          {isAuth ? (
            <Link to="/account" className='text-sm text-gray-700' >{user?.name ? user?.name.charAt(0).toUpperCase() + user?.name.slice(1) : 'Account'}</Link>
          ) : (
            <Link to="/login" className='text-sm text-gray-700' >Login</Link>
          )}
        </div>
      </div>
      {/* search  bar*/}
      {
        isHome && (
          <div className='border-t px-4 py-3' >
            <div className="mx-auto flex max-w-7xl items-center rounded-lg border-[.5px] shadow-sm">
              <div className="flex items-center gap-2 px-3 border-r text-gray-700">
                <BiMap className='h-4 w-4 text-[#E23774] ' />
                <span className='text-sm truncate max-w-35' >city</span>
              </div>
              <div className="flex flex-1 items-center gap-2 px-3">
                <BiSearch className='h-4 w-4 text-gray-400F' />
                <input
                  type="text"
                  placeholder='Search for Resturant...'
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                  className='w-full py-2 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none'
                />
              </div>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default Navbar