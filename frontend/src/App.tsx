import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { Toaster } from "react-hot-toast"
import PublicRoute from './components/publicRoute'
import ProtectedRoute from './components/protectedRoute'
import SelectRole from './pages/SelectRole'
// import Navbar from './components/navbar'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import Restaurant from "./pages/Restaurant"
import Unauthorized from './pages/Unauthorized'
import { useAppData } from './context/AppContext'
import RestaurantPage from './pages/RestaurantPage'
import Cart from './pages/Cart'
function App() {

  const { user, loading } = useAppData()
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  }
  if (user && user?.role === "seller") {
    return <Restaurant />
  }

  return (
    <>

      <BrowserRouter>
        {/* <Navbar />      flashing of unauthorized content without authentication  moved to protectedRoute wrapper */}
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />} >
            <Route path='/login' element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />} >
            <Route path='/' element={<Home />} />
            <Route path='/restaurant/:id' element={<RestaurantPage />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/select-role' element={<SelectRole />} />
            <Route path='/account' element={<Account />} />
          </Route>
          {/* Error Pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
