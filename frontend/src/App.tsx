import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { Toaster } from "react-hot-toast"
import PublicRoute from './components/publicRoute'
import ProtectedRoute from './components/protectedRoute'
import SelectRole from './pages/SelectRole'
import Navbar from './components/navbar'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import Restaurant from "./pages/Restaurant"
import Unauthorized from './pages/Unauthorized'
import { useAppData } from './context/AppContext'
function App() {

  const { user } = useAppData()
  // if (user && user?.role === "seller") {
  //   return <Restaurant />
  // }

  return (
    <>

      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />} >
            <Route path='/login' element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />} >
            <Route path='/' element={user?.role === 'seller' ? <Restaurant /> : <Home />} />
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
